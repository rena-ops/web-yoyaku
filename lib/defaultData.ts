import { Dosen } from './types'

export const defaultData: Dosen[] = [
  {
    id: 'd1', dosen: '希望施術を当院で初めて受ける方', tabIdx: 0, multiSel: true,
    cats: [
      {
        id: 'c1', name: 'カウンセリングのみ',
        menus: [
          { id: 'm1', name: 'しみ・くすみ・赤み のご相談', master: 'しみ／くすみ／赤み のご相談', desc: '複数施術をお悩みの方は、当日お知らせください。', price: '無料', time: '30分' },
          { id: 'm2', name: 'しわ・たるみ のご相談', master: 'しわ／たるみ のご相談', desc: '複数施術をお悩みの方は、当日お知らせください。', price: '無料', time: '30分' },
          { id: 'm3', name: 'にきび・にきび跡 のご相談', master: 'にきび／にきび跡 のご相談', desc: '複数施術をお悩みの方は、当日お知らせください。', price: '無料', time: '30分' },
          { id: 'm4', name: '毛穴 のご相談', master: '毛穴 のご相談', desc: '複数施術をお悩みの方は、当日お知らせください。', price: '無料', time: '30分' },
          { id: 'm5', name: '複数のお悩みがある方・内容に迷われている方', master: '複数のお悩みがある方／内容に迷われている方', desc: '内容に迷われている方はこちらをご選択ください。', price: '無料', time: '30分' },
          { id: 'm6', name: '美容点滴のご相談', master: '美容点滴のご相談', desc: '複数施術をお悩みの方は、当日お知らせください。', price: '無料', time: '30分' },
        ]
      },
      {
        id: 'c2', name: 'カウンセリング＋当日施術希望',
        menus: [
          { id: 'm7', name: 'ピコトーニング', master: '初診カウンセリング|ピコショット／ピコトーニング', desc: '', price: '', time: '' },
          { id: 'm8', name: 'フォトフェイシャル', master: '初診カウンセリング|フォトフェイシャル', desc: '', price: '', time: '' },
          { id: 'm9', name: 'レーザーシャワー', master: '初診カウンセリング|レーザーシャワー', desc: '', price: '', time: '' },
          { id: 'm10', name: 'シルファーム', master: '初診カウンセリング|シルファーム', desc: '', price: '', time: '' },
          { id: 'm11', name: 'ハイフ', master: '初診カウンセリング|ハイフ', desc: '', price: '', time: '' },
          { id: 'm12', name: 'リニア', master: '初診カウンセリング|リニア', desc: '', price: '', time: '' },
          { id: 'm13', name: 'エレクトロポレーション', master: '初診カウンセリング|メソナ', desc: '', price: '', time: '' },
          { id: 'm14', name: '水光注射', master: '初診カウンセリング|水光注射', desc: '', price: '', time: '' },
          { id: 'm15', name: 'ケミカルピーリング', master: '初診カウンセリング|ケミカルピーリング', desc: '', price: '', time: '' },
          { id: 'm16', name: 'マッサージピール', master: '初診カウンセリング|マッサージピール', desc: '', price: '', time: '' },
          { id: 'm17', name: 'ミラノリピール', master: '初診カウンセリング|ミラノリピール', desc: '', price: '', time: '' },
          { id: 'm18', name: 'ハイドラフェイシャル', master: '初診カウンセリング|ハイドラフェイシャル', desc: '', price: '', time: '' },
          { id: 'm19', name: 'ダーマペン', master: '初診カウンセリング|ダーマペン', desc: '', price: '', time: '' },
          { id: 'm20', name: '医療脱毛', master: '初診カウンセリング|医療脱毛', desc: '', price: '', time: '' },
          { id: 'm21', name: '美容点滴', master: '初診カウンセリング|美容点滴', desc: '', price: '', time: '' },
        ]
      }
    ]
  },
  {
    id: 'd2', dosen: '希望施術を当院で受けたことがある方', tabIdx: 1, multiSel: false,
    cats: [
      {
        id: 'c3', name: '当日施術希望',
        menus: [
          { id: 'm22', name: 'ピコショット／ピコトーニング', master: 'ピコショット／ピコトーニング', desc: '', price: '', time: '' },
          { id: 'm23', name: 'フォトフェイシャル', master: 'フォトフェイシャル', desc: '', price: '', time: '' },
          { id: 'm24', name: 'レーザーシャワー', master: 'レーザーシャワー', desc: '', price: '', time: '' },
          { id: 'm25', name: 'シルファーム', master: 'シルファーム', desc: '', price: '', time: '' },
          { id: 'm26', name: 'ハイフ', master: 'ハイフ', desc: '', price: '', time: '' },
          { id: 'm27', name: 'リニア', master: 'リニア', desc: '', price: '', time: '' },
          { id: 'm28', name: 'エレクトロポレーション', master: 'メソナ', desc: '', price: '', time: '' },
          { id: 'm29', name: '水光注射（ハイコックス）', master: '水光注射', desc: '', price: '', time: '' },
          { id: 'm30', name: 'ケミカルピーリング', master: 'ケミカルピーリング', desc: '', price: '', time: '' },
          { id: 'm31', name: 'マッサージピール', master: 'マッサージピール', desc: '', price: '', time: '' },
          { id: 'm32', name: 'ミラノリピール', master: 'ミラノリピール', desc: '', price: '', time: '' },
          { id: 'm33', name: 'ハイドラフェイシャル', master: 'ハイドラフェイシャル', desc: '', price: '', time: '' },
          { id: 'm34', name: 'ダーマペン', master: 'ダーマペン', desc: '', price: '', time: '' },
          { id: 'm35', name: '医療脱毛', master: '医療脱毛', desc: '', price: '', time: '' },
          { id: 'm36', name: '美容点滴', master: '美容点滴', desc: '', price: '', time: '' },
        ]
      },
      {
        id: 'c4', name: 'カウンセリング＋当日施術希望',
        menus: [
          { id: 'm37', name: 'ピコショット／ピコトーニング', master: '再診カウンセリング|ピコショット／ピコトーニング', desc: '', price: '', time: '' },
          { id: 'm38', name: 'フォトフェイシャル', master: '再診カウンセリング|フォトフェイシャル', desc: '', price: '', time: '' },
          { id: 'm39', name: 'レーザーシャワー', master: '再診カウンセリング|レーザーシャワー', desc: '', price: '', time: '' },
          { id: 'm40', name: 'シルファーム', master: '再診カウンセリング|シルファーム', desc: '', price: '', time: '' },
          { id: 'm41', name: 'ハイフ', master: '再診カウンセリング|ハイフ', desc: '', price: '', time: '' },
          { id: 'm42', name: 'リニア', master: '再診カウンセリング|リニア', desc: '', price: '', time: '' },
          { id: 'm43', name: 'エレクトロポレーション', master: '再診カウンセリング|メソナ', desc: '', price: '', time: '' },
        ]
      }
    ]
  }
]
