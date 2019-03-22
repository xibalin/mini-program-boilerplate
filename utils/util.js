/**
 * 补充时间戳长度
 * @param {Number} timeStamp
 * @returns {Number}
 */
function fillTimestamp(timeStamp, length = 13) {
  let strTimeStamp = timeStamp + "";
  let strLength = strTimeStamp.length;
  if (strLength !== length) {
      for (let i = 0; i < Math.abs(strLength - length); i++) {
          strTimeStamp += "0";
      }
  }

  return strTimeStamp.substr(0, length) * 1;
}
/**
 * 补零操作
 * @param {Number} n
 */
export function addZero(n) {
  return !isNaN(n) && typeof n === "number" ? (n.toString().length <= 1 ? "0" : "") + n : n;
}

/**
 * 日期格式化
 * @param {Date|number} date
 * @param {String} format
 */
const dateFormat = function(date, format) {
  if (!date) {
      return date;
  }
  if (type(date) === "number") {
      date = new Date(fillTimestamp(date));
  }
  if (date.toString() !== "Invalid Date") {
      let y = date.getFullYear().toString(),
          M = addZero(date.getMonth() + 1),
          d = addZero(date.getDate()),
          h = addZero(date.getHours()),
          m = addZero(date.getMinutes()),
          s = addZero(date.getSeconds()),
          S = addZero(date.getMilliseconds()),
          q = Math.ceil(M / 3).toString(); //季度

      let arrayObj = [
          {
              value: y,
              regular: /(y{1,4})/gi,
              max: 4
          },
          {
              value: M,
              regular: /(M{1,2})/g
          },
          {
              value: d,
              regular: /(d{1,2})/gi
          },
          {
              value: h,
              regular: /(h{1,2})/gi
          },
          {
              value: m,
              regular: /(m{1,2})/g
          },
          {
              value: s,
              regular: /(s{1,2})/g
          },
          {
              value: S,
              regular: /(S{1,3})/g,
              max: 3
          },
          {
              value: q,
              regular: /(q{1,2})/g
          }
      ];

      arrayObj.forEach(function(o) {
          if (o.regular.test(format)) {
              let v = RegExp.$1,
                  maxLength = o.max || 2;
              format = format.replace(v, o.value.substring(maxLength - v.length));
          }
      });
      return format;
  }
  return date;
}
module.exports = {
  dateFormat,
}
