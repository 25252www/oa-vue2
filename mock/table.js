const Mock = require('mockjs')

const data = Mock.mock({
  'items|5': [{
    'id|1-9999': 0,
    'studentId|1-9999': 0,
    leaveTime: '2022-10-30 10:54:09',
    days: 2,
    destination: '12',
    transportation: 'eww',
    reason: 'xxx',
    phone: 'asf',
    material: '///',
    createTime: '2022-10-25 10:54:27',
    'state|1': [0, 1, 2]
  }]
})

module.exports = [
  {
    url: '/vue-admin-template/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
