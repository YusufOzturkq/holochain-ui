import { ActionType, getType } from 'typesafe-actions'
import * as chatActions from './actions'
import { Channel } from './types/model/channel'
import { Message } from './types/model/message'
import { Identity } from './types/model/identity'
import { Map } from 'immutable'

// create a union type that is all possible chat actions
export type ChatAction = ActionType<typeof chatActions>

export interface HoloChatState {
  readonly myChannels: Array<Channel>,
  readonly channelSubjects: Map<String, Array<String>>,
  readonly currentMessages: Array<Message>
  readonly activeChannel: Channel | null,
  readonly activeChannelMembers: Array<Identity>,
  readonly myHash: string | null,
  readonly users: Array<Identity>
}

export const initialState: HoloChatState = {
  myChannels: [],
  channelSubjects: Map(),
  currentMessages: [],
  activeChannel: null,
  activeChannelMembers: [],
  myHash: null,
  users: []
}

export function holochatReducer (state = initialState, action: ChatAction) {
  // console.log('Current state: ', state)
  // console.log('processing action: ', action)
  switch (action.type) {
    case getType(chatActions.GetMyChannels.success):
    	return {
      ...state,
      myChannels: action.payload.data
    }
    case getType(chatActions.GetMessages.success):
      return {
        ...state,
        currentMessages: action.payload.data
      }
    case getType(chatActions.GetMembers.success):
      return {
        ...state,
        activeChannelMembers: action.payload.data
      }
    case getType(chatActions.SetActiveChannel):
      return {
        ...state,
        activeChannel: action.payload
      }
    case getType(chatActions.GetProfile.success):
      return {
        ...state,
        myHash: action.payload.data
      }
    case getType(chatActions.GetAllMembers.success):
      console.log(action.payload.data)
      let users: Array<Identity> = action.payload.data.map((user: any) => ({
        hash: user.id,
        handle: user.profile.handle,
        email: user.profile.email,
        avatar: user.profile.avatar
      }))
      return {
        ...state,
        users: users
      }
    default:
      return state
  }
}

export default holochatReducer
