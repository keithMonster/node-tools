import { getJsonResult } from '../core.mjs';
export default function run() {
  getJsonResult(
    '客服',
    '抖音私信',
    fetch(
      'https://oss-bill-qa.dustess.net/bill-trail-settings-api/trail/event/8af0a754d4d442ceb1108ed64f54fda1?sessionId=JWT.eyJhbGciOiJSUzI1NiIsImtpZCI6ImR1Yy5vcGVuaWQuaWQtdG9rZW4iLCJ0eXAiOiJKV1QifQ.eyJhdF9oYXNoIjoic0xHckJld0QzNm8ybWN0UVNCUzkxUSIsImF1ZCI6WyJvc3NfYmlsbF9xYV8wMV9zcnYiXSwiYXV0aF90aW1lIjoxNzE5NDY5MzQyLCJlbWFpbCI6ImRvbmdjZ0BkdXN0ZXNzLmNvbSIsImV4cCI6MTcxOTUxMjU0MiwiaWF0IjoxNzE5NDY5MzQyLCJpc3MiOiJodHRwczovL2R1Yy5kdXN0ZXNzLmNvbS9hcGkvdjEvb2F1dGgyIiwianRpIjoiNzA4YTRhMzMtZDNkOC00ZTc5LWJjNTctMDU3ZDQzNmMyNDQwIiwibm9uY2UiOiIxMjM0NTY3OCIsInJhdCI6MTcxOTQ2OTM0Miwic3ViIjoiNTY0Iiwid2Vjb21fdWlkIjoiZG9uZ2NoYW9nZSJ9.OO98SqfCLy4nB8e1dL4Za9VWT0xdedpTQjb82QWSDlYA0QYWDSWMdNMav35iZu6J9SSmxnJNj6HFYI4oTdXQvQcuK-QYHSMk35rx25OKQUVya_qkbSLqYL2_OV0oIaT5Zgx_d8-A3eNXyR7OqxxiA5SQflvxpfoAIrRKXrSgYV4',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
          authorization:
            'JWT.eyJhbGciOiJSUzI1NiIsImtpZCI6ImR1Yy5vcGVuaWQuaWQtdG9rZW4iLCJ0eXAiOiJKV1QifQ.eyJhdF9oYXNoIjoic0xHckJld0QzNm8ybWN0UVNCUzkxUSIsImF1ZCI6WyJvc3NfYmlsbF9xYV8wMV9zcnYiXSwiYXV0aF90aW1lIjoxNzE5NDY5MzQyLCJlbWFpbCI6ImRvbmdjZ0BkdXN0ZXNzLmNvbSIsImV4cCI6MTcxOTUxMjU0MiwiaWF0IjoxNzE5NDY5MzQyLCJpc3MiOiJodHRwczovL2R1Yy5kdXN0ZXNzLmNvbS9hcGkvdjEvb2F1dGgyIiwianRpIjoiNzA4YTRhMzMtZDNkOC00ZTc5LWJjNTctMDU3ZDQzNmMyNDQwIiwibm9uY2UiOiIxMjM0NTY3OCIsInJhdCI6MTcxOTQ2OTM0Miwic3ViIjoiNTY0Iiwid2Vjb21fdWlkIjoiZG9uZ2NoYW9nZSJ9.OO98SqfCLy4nB8e1dL4Za9VWT0xdedpTQjb82QWSDlYA0QYWDSWMdNMav35iZu6J9SSmxnJNj6HFYI4oTdXQvQcuK-QYHSMk35rx25OKQUVya_qkbSLqYL2_OV0oIaT5Zgx_d8-A3eNXyR7OqxxiA5SQflvxpfoAIrRKXrSgYV4',
          'sec-ch-ua':
            '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          cookie:
            'sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2218d77053ce3995-0530bde91a9e4e4-1e525637-1484784-18d77053ce4406%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22%24device_id%22%3A%2218d77053ce3995-0530bde91a9e4e4-1e525637-1484784-18d77053ce4406%22%7D; dustess.aid=W00000000514',
          Referer: 'https://oss-bill-qa.dustess.net/',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: null,
        method: 'GET',
      }
    )
  );
}
