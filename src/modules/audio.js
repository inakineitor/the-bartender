/* Packages */
import { existsSync, readdirSync, mkdirSync } from 'fs';

/* Modules and files */
import logger from '../helpers/logger';
import clientState from '../state';

/* Enviorment variables */
const { AUDIO_PATH } = process.env;
if (!AUDIO_PATH) throw new Error('Missing VOICE_PATH environment variable');

/* Audio functionality */
// TODO: I don't really know where to put this functions, so for now it stays here
// TODO: Should this function accept parameters in the first place?
export const configureAudioFilesPath = async (audioFilespath = AUDIO_PATH) => {
  if (!existsSync(audioFilespath)) {
    logger.debug(`Audio folder [${audioFilespath}] does not exists, creating one...`);
    mkdirSync(audioFilespath);
    logger.debug(`Audio folder [${audioFilespath}] created`);
  } else {
    const totalFiles = readdirSync(audioFilespath).length;
    logger.debug(`Audio folder [${audioFilespath}] found with [${totalFiles}] files`);
  }
};

export const connectToVoiceChannel = async (voiceChannel) => {
  const existingVoiceConnection = clientState.voiceConnections[voiceChannel.id];
  if (existingVoiceConnection) {
    logger.connection(`A connection for the voice channel [${voiceChannel.id}] already exists`);
    return existingVoiceConnection;
  }

  logger.connection(
    `No existing voice connection for voice channel [${voiceChannel.id}] found, connecting to voice channel...`
  );
  const voiceConnection = await voiceChannel.join();
  logger.connection('Connection successful');

  logger.debug('Saving voice connection to the state');
  clientState.voiceConnections[voiceChannel.id] = voiceConnection;

  return voiceConnection;
};

export const disconnectFromVoiceChannel = async (voiceChannel) => {
  if (!voiceChannel) {
    logger.connection(
      `No connection for the voice channel [${voiceChannel.id}] found, unable disconnect`
    );
    return;
  }

  logger.connection(`Attempting to disconnect from voice channel [${voiceChannel.id}]...`);
  await voiceChannel.leave();
  logger.connection('Disconnection successful');
};

export const playAudioFile = async (voiceConnection, filePath) => {
  // TODO: Where the fuck do I check if the voice connection is valid if it's not here?
  if (!voiceConnection) {
    logger.connection(`The provided voice connection is not valid, the audio file won't be played`);
    return;
  }

  logger.debug(`Playing audio file [${filePath}] at voice channel [${voiceConnection.channel.id}]`);
  await voiceConnection.play(filePath, { volume: 1 });
};
