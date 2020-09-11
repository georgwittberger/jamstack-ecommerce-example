import Router from '@koa/router'
import { ParameterizedContext } from 'koa'
import { UserInfo } from '../salesforce/types'

export function getUserInfo(
  ctx: ParameterizedContext<any, Router.RouterParamContext<any, {}>>
): UserInfo {
  if (!ctx.state.user) {
    throw new Error('Missing user state in request')
  }
  return {
    user_id: ctx.state.user.sub.replace(/^.+\/(\w+)$/, '$1'),
    preferred_username: ctx.state.user.preferred_username,
    name: ctx.state.user.name,
    given_name: ctx.state.user.given_name,
    family_name: ctx.state.user.family_name,
    nickname: ctx.state.user.nickname,
    email: ctx.state.user.email,
    email_verified: ctx.state.user.email_verified,
    phone_number: ctx.state.user.phone_number,
    phone_number_verified: ctx.state.user.phone_number_verified,
    zoneinfo: ctx.state.user.zoneinfo,
    picture: ctx.state.user.picture,
    address: ctx.state.user.address
      ? {
          street_address: ctx.state.user.address.street_address,
          postal_code: ctx.state.user.address.postal_code,
          locality: ctx.state.user.address.locality,
          country: ctx.state.user.address.country,
        }
      : undefined,
    locale: ctx.state.user.locale,
  }
}
