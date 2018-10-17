
module.exports = function (options={}) {
  return async context => {
    const { data } = context;

    if (!data.msg) {
      throw new Error('A message must have a msg');
    }

    context.data = {
      msg: context.data.msg,
      participant: context.data.participant,
      meeting: context.data.meeting,
      time: new Date().getTime()
    };

    return context;

  };
};
