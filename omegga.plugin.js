class BuildingClone {
  constructor(omegga, config, store) {
    this.omegga = omegga;
    this.config = config;
    this.store = store;
  }

  async init() {
    this.omegga
      .on('cmd:clone', this.clone);

    return {
      registeredCommands: ['clone']
    };
  }

  unauthorized(senderName) {
    const player = this.omegga.getPlayer(senderName);
    if (
      this.config['only-authorized'] && !player.isHost() &&
      !this.config['authorized-users'].some(p => player.id === p.id)
    ) {
      this.omegga.whisper(senderName, '<color="ff0000">Unauthorized to use command.</>');
      return true;
    }
    return false;
  }

  clone = async (senderName) => {
    if (this.unauthorized(senderName)) return;
    const player = this.omegga.getPlayer(senderName);
    const nameColor = player.getNameColor();
    this.omegga.broadcast(`<b><color="${nameColor}">${senderName}</></> cloning selection...`);
    const saveData = await player.getTemplateBoundsData();
    await player.loadDataAtGhostBrick(saveData);
  }

  stop() {
    this.omegga
      .removeListener('cmd:clone', this.clone);
  }
}

module.exports = BuildingClone;