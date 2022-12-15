import { router } from '../../index';
import * as p from './procedures';

export const discordUserRouter = router({
  updateUserImage: p.updateUserImage
})