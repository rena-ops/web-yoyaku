export interface MenuItem {
  id: string
  name: string
  master: string
  desc: string
  price: string
  time: string
}

export interface Category {
  id: string
  name: string
  menus: MenuItem[]
}

export interface Dosen {
  id: string
  dosen: string
  tabIdx: number
  multiSel: boolean
  cats: Category[]
}
