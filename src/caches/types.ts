export interface Cache<K, V = null | Record<string, any>> {
  delete(key: K): Promise<boolean>
  get(key: K): Promise<V>
  set(key: K, value: V, timeout: number): Promise<Cache<K, V>>
}
