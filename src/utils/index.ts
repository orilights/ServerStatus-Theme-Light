import type { ServerData } from '@/types'

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0)
    return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

export function formatTime(seconds: number) {
  const date = new Date(seconds * 1000)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')
  return `${year}/${month}/${day} ${hour}:${minute}:${second}`
}

export function isOnline(server: ServerData) {
  return server.online4 || server.online6
}

export function isCountryFlagEmoji(text: string) {
  const regex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
  return regex.test(text)
}

export function hasLoadData(server: ServerData) {
  return server.load === undefined
    && server.load_1 === undefined
    && server.load_5 === undefined
    && server.load_15 === undefined
}

export function parseLabels(labelsString: string | undefined) {
  if (labelsString === undefined)
    return {}
  const list = labelsString.split(';')
  const result: { [key: string]: string } = {}
  list.forEach((item) => {
    if (item === '')
      return
    const [key, value] = item.split('=')
    result[key] = value
  })
  return result
}
