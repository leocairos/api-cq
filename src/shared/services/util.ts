const remoteIp = req => {
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',').pop() || // Recupera o IP de origem, caso a fonte esteja utilizando proxy
    req.connection.remoteAddress || // Recupera o endereço remoto da chamada
    req.socket.remoteAddress || // Recupera o endereço através do socket TCP
    req.connection.socket.remoteAddress; // Recupera o endereço através do socket da conexão
  return ip;
};

export default remoteIp;
