export const decodeBase64Audio = (base64String: string) => {
    const base64Data = base64String.replace(/^data:audio\/\w+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  };
  