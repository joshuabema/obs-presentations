import { scene01 } from './scene01.js'
import { scene02 } from './scene02.js'
import { scene03 } from './scene03.js'
import { scene04 } from './scene04.js'
import { scene05 } from './scene05.js'
import { scene06 } from './scene06.js'
import { scene07 } from './scene07.js'
import { scene08 } from './scene08.js'
import { scene09 } from './scene09.js'
import { scene10 } from './scene10.js'
import { scene11 } from './scene11.js'
import { scene12 } from './scene12.js'
import { scene13 } from './scene13.js'
import { scene14 } from './scene14.js'
import { scene15 } from './scene15.js'
import { scene16 } from './scene16.js'
import { scene17 } from './scene17.js'
import { scene18 } from './scene18.js'
import { scene19 } from './scene19.js'
import { scene20 } from './scene20.js'
import { scene21 } from './scene21.js'
import { scene22 } from './scene22.js'
import { scene23 } from './scene23.js'
import { scene24 } from './scene24.js'
import { scene25 } from './scene25.js'
import { scene26 } from './scene26.js'
import { scene27 } from './scene27.js'
import { scene28 } from './scene28.js'
import { scene29 } from './scene29.js'
import { scene30 } from './scene30.js'
import { scene31 } from './scene31.js'
import { scene32 } from './scene32.js'
import { scene33 } from './scene33.js'
import { scene34 } from './scene34.js'
import { scene35 } from './scene35.js'
import { scene36 } from './scene36.js'
import { scene37 } from './scene37.js'
import { scene38 } from './scene38.js'
import { scene39 } from './scene39.js'

const codedScenes = {
  '01': scene01,
  '02': scene02,
  '03': scene03,
  '04': scene04,
  '05': scene05,
  '06': scene06,
  '07': scene07,
  '08': scene08,
  '09': scene09,
  '10': scene10,
  '11': scene11,
  '12': scene12,
  '13': scene13,
  '14': scene14,
  '15': scene15,
  '16': scene16,
  '17': scene17,
  '18': scene18,
  '19': scene19,
  '20': scene20,
  '21': scene21,
  '22': scene22,
  '23': scene23,
  '24': scene24,
  '25': scene25,
  '26': scene26,
  '27': scene27,
  '28': scene28,
  '29': scene29,
  '30': scene30,
  '31': scene31,
  '32': scene32,
  '33': scene33,
  '34': scene34,
  '35': scene35,
  '36': scene36,
  '37': scene37,
  '38': scene38,
  '39': scene39,
}

export const scenes = Object.freeze(
  Object.fromEntries(
    Array.from({ length: 39 }, (_, index) => {
      const id = String(index + 1).padStart(2, '0')
      return [id, codedScenes[id]]
    }),
  ),
)
