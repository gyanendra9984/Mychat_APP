export const getsender = (loggeduser, users) => {
  console.log(loggeduser);
  return users[0]._id === loggeduser._id ? users[1].name : users[0].name;
};

export const getsenderfull = (loggeduser, users) => {
  return users[0]._id === loggeduser._id ? users[1] : users[0];
};

export const issamesender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const islastmessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[i].sender._id !== userId &&
    messages[i].sender._id
  );
};

export const issamesendermargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};


export const issameuser = (messages, m,i) => {
  return (
    i> 0 &&
    messages[i-1].sender._id ===m.sender._id
  );
};
