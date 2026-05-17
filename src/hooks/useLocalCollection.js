import { useEffect, useState, useCallback } from 'react'
import { addRecord, deleteRecord, getData, onChange, updateRecord } from '../utils/storage.js'

export const useLocalCollection = (key) => {
  const [items, setItems] = useState(() => getData(key, []))

  const refresh = useCallback(() => setItems(getData(key, [])), [key])

  useEffect(() => {
    // Same-tab updates via custom event
    const offCustom = onChange(key, refresh)
    // Cross-tab updates via native storage event
    const onStorage = (e) => { if (e.key === 'medicare:' + key) refresh() }
    window.addEventListener('storage', onStorage)
    return () => { offCustom(); window.removeEventListener('storage', onStorage) }
  }, [key, refresh])

  const add = (rec) => { addRecord(key, rec); refresh() }
  const update = (id, patch) => { updateRecord(key, id, patch); refresh() }
  const remove = (id) => { deleteRecord(key, id); refresh() }

  return { items, add, update, remove, refresh, setItems }
}
