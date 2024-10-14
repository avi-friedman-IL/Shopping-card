import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import { userService } from '../user/user.service.js'
import { logger } from '../../services/logger.service.js'

export const authService = {
  signup,
  login,
  getLoginToken,
  validateToken,
}

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

async function login(email, password, cart) {
  logger.debug(`auth.service - login with email: ${email}`)

  const user = await userService.getByEmail(email)
  if (!user) throw new Error('Invalid email or password')

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new Error('Invalid email or password')

  delete user.password
  return user
}

async function signup(email, password, fullname, cart) {
  const saltRounds = 10

  logger.debug(
    `auth.service - signup with email: ${email}, fullname: ${fullname}`
  )
  if (!email || !password || !fullname) throw new Error('Missing details')

  const hash = await bcrypt.hash(password, saltRounds)
  return userService.add({ email, password: hash, fullname, cart })
}

function getLoginToken(user) {
  const userInfo = {
    _id: user._id,
    fullname: user.fullname,
    cart: user.cart,
    isAdmin: user.isAdmin,
  }
  return cryptr.encrypt(JSON.stringify(userInfo))
}

function validateToken(loginToken) {
  try {
    const json = cryptr.decrypt(loginToken)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
  } catch (err) {
    console.log('Invalid login token')
  }
  return null
}
