import { hash, compare } from 'bcryptjs';
import { Request } from 'express';

class BCryptHash {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}

const remoteIp = (request: Request): string => {
  const ip =
    request.socket.remoteAddress || // Recupera o endereço através do socket TCP
    (request.headers['x-forwarded-for'] || ['']).split(',').pop() || // Recupera o IP de origem, caso a fonte esteja utilizando proxy
    request.connection.remoteAddress || // Recupera o endereço remoto da chamada
    request.connection.socket.remoteAddress; // Recupera o endereço através do socket da conexão
  return ip;
};

export { remoteIp, BCryptHash };
