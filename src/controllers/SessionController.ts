import SessionService from '../services/SessionService';
import IRestoreSessionDTO from '../mappers/IRestoreSessionDTO';
import RequestError from '../errors/RequestError';
import ERRORS from '../../constants/ERRORS';
import IRemoveSessionDTO from '../mappers/IRemoveSessionDTO';


export default class SessionController {
  private readonly sessionService = new SessionService()

  async removeSession({user}: IRemoveSessionDTO){
    await this.sessionService.removeSession({user});
  }

  async restoreSession({token}: IRestoreSessionDTO){
    if(!token) throw new RequestError(401);

    try {
      return await this.sessionService.restoreSession({token});
    } catch (e) {
      if(e.message === ERRORS.SESSION.INVALID_TOKEN){
        throw new RequestError(403)
      }
    }
  }
}
