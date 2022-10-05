import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  cliente: null as MongoClient,
  async connect (uri: string): Promise<void> {
    this.client = new MongoClient(uri)
    this.client.connect(uri, {
      proxyUsername: true,
      useUnifiedTopology: true
    })
  },
  async disconnect (): Promise<void> {
    this.cliente.close()
  },
  getCollection (name: string): Collection {
    return this.cliente.db().collection(name)
  },
  clearCollection (name: string): void {
    this.client.db().collection(name).deleteMany()
  }
}
