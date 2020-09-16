import { hash, compare } from 'bcryptjs';

class BCryptHash {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}

const remoteIp = req => {
  const ip =
    req.socket.remoteAddress || // Recupera o endereço através do socket TCP
    (req.headers['x-forwarded-for'] || '').split(',').pop() || // Recupera o IP de origem, caso a fonte esteja utilizando proxy
    req.connection.remoteAddress || // Recupera o endereço remoto da chamada
    req.connection.socket.remoteAddress; // Recupera o endereço através do socket da conexão
  return ip;
};

export { remoteIp, BCryptHash };
