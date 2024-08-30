import { Injectable, NotFoundException } from '@nestjs/common';
import { Preference, Payment} from 'mercadopago';
import { client } from 'src/config/mercadopago';
import { dataPaymentDto } from './dtos/dataPayment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentDetail } from './entities/paymentDetail.entity';
import { Repository } from 'typeorm';
import { TournamentEntity } from 'src/tournament/entities/tournament.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MercadoPagoService {
  constructor(
    @InjectRepository(PaymentDetail)
    private paymentDetailRepository: Repository<PaymentDetail>,
    @InjectRepository(TournamentEntity)
    private tournamentRepository: Repository<TournamentEntity>,
    @InjectRepository(User)
    private userRepsoitory: Repository<User>
  ){}
  async mpConnections(req: dataPaymentDto) {
    
    const tournament = await this.tournamentRepository.findOne({where: {id: req.tournament}})
    const user = await this.userRepsoitory.findOne({where: { id: req.user}})
    
    const body = {
      items: [
        {
          title: tournament.name,
          quantity: 1,
          unit_price: tournament.price,
          description: tournament.description,
          currency_id: 'ARS',
          id: ''
        },
      ],
      back_urls: {
        success: `${req.host}/${req.tournament}`,
        failure: `${req.host}/${req.tournament}`,
        pending: `${req.host}/${req.tournament}`
      },
      auto_return: "approved",
      external_reference: req.user
      };
    const preference = await new Preference(client).create({ body })

    const prefId = {
      preferenceId: preference.id,
      tournament: tournament,
      user: user,
      external_reference: preference.external_reference
    }
    
    await this.paymentDetailRepository.save(prefId)
    return {redirectUrl: preference.init_point}
  }

  async feedbackPayment(paymentDetails: any) {
    console.log(paymentDetails)
    const user = await this.userRepsoitory.findOne({where: {id: paymentDetails.additional_info}})
    const payDetail = await this.paymentDetailRepository.findOne({where: {user: user}})

    const pay = {
      payment_id: paymentDetails.payment,
      status: paymentDetails.status,
      date_created: paymentDetails.date_created,
      date_last_update: paymentDetails.date_last_update,
      transaction_amount: paymentDetails.transaction_amount,
      payment_method_id: paymentDetails.payment_method_id,
      payment_type_id: paymentDetails.payment_type_id,
    }
    const paymentDetailComplete = await this.paymentDetailRepository.update(payDetail.id, pay)
    
    return paymentDetailComplete
  }

  async getPreferenceByUserId(id: string) {
    const user = await this.userRepsoitory.findOne({where: {id}})
    const preference  =await this.paymentDetailRepository.findOne({where: {user: user }})
    if(!user){
      throw new NotFoundException('No fue posible encontrar al usuario')
    }
    if(!preference){
      throw new NotFoundException('Parece que el usuario no tiene ninguna preferencia ligada')
    }
    return preference
  }
}
