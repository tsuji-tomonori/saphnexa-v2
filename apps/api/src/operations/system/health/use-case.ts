import { ApiError } from '../../../shared/http/errors.js'

import { healthResponseSample } from './samples.js'

export const getHealth = ({ fail }: { fail?: boolean } = {}) => {
  if (fail) throw new ApiError(409, 'HEALTH_CHECK_CONFLICT', 'ヘルスチェックを完了できません')
  return healthResponseSample
}
