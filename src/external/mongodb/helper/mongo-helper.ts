import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  cliente: null as MongoClient,
  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },
  async disconnect (): Promise<void> {
    this.client.close()
  },
  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },
  async clearCollection (name: string): Promise<void> {
    this.client.db().collection(name).deleteMany({})
  }
}
