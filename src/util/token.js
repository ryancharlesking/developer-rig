import { ViewerTypes } from '../constants/viewer-types';
import { RIG_ROLE } from '../constants/rig';
import jwt from 'jsonwebtoken';

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const idSource = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const idLength = 15;

function generateOpaqueID() {
  let id = '';
  for (let i = 0; i < idLength; i++) {
    id += idSource.charAt(Math.floor(Math.random() * idSource.length));
  }
  return id;
}

export function createToken(newRole, isLinked, ownerID, channelId, secret, index) {
  switch (newRole) {
    case ViewerTypes.LoggedOut:
      return createSignedToken('viewer', 'ARIG' + generateOpaqueID(), '', channelId, secret)
    case ViewerTypes.LoggedIn:
      if (isLinked) {
        return createSignedToken('viewer', 'URIG000'+index, 'RIG'+ownerID, channelId, secret)
      } else {
        return createSignedToken('viewer', 'URIG' + generateOpaqueID(), '', channelId, secret)
      }
    case ViewerTypes.Broadcaster:
      return createSignedToken('broadcaster', 'URIG' + ownerID, 'RIG' + ownerID, channelId, secret)
    default:
      return createSignedToken(RIG_ROLE, 'ARIG' + generateOpaqueID(), '', channelId, secret);
  }
}

export function createSignedToken(role, opaqueUserId, userId, channelId, secret) {
  const payload = {
    exp: Math.floor(((Date.now() + ONE_YEAR_MS) / 1000)),
    opaque_user_id: opaqueUserId,
    channel_id: channelId,
    role: role,
    pubsub_perms: {
      listen: ['broadcast'],
      send: ['*'],
    },
  };

  if (userId !== '') {
    payload['user_id'] = userId;
  }

  return jwt.sign(payload, new Buffer(secret, 'base64'), { algorithm: 'HS256' });
}
