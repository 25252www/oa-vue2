import request from '@/utils/request'

export function getStudentsLeaveList(params) {
  return request({
    url: '/students/leave/list',
    method: 'get',
    params
  })
}

export function getTeachersLeaveList(params) {
  return request({
    url: '/teachers/leave/list',
    method: 'get',
    params
  })
}

export function putStudentsLeave(data) {
  return request({
    url: '/students/leave',
    method: 'put',
    data
  })
}

// export function postLeavesUpload(data) {
//   return request({
//     url: '/leaves/upload',
//     method: 'post',
//     data
//   })
// }

export function postTeachersLeaveProcess(data) {
  return request({
    url: '/teachers/leave/process',
    method: 'post',
    data
  })
}

export function deleteTeachersLeave(param) {
  return request({
    url: '/teachers/leave/' + param,
    method: 'delete'
  })
}

export function getLeavesDownload() {
  return request({
    url: '/leaves/download',
    method: 'get'
  })
}

