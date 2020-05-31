export default interface FileStore {
  saveFile: (file: File, path: string) => Promise<void>
}
