function _getGroups(arr: any) {
  if (arr.length > 1 && arr[0] === "") arr[0] = "*";
  return arr.reduce((o: any, str: any) => {
    if (str[0] !== undefined) {
      const sym = str[0].toString();
      if (!o[sym]) o[sym] = [];
      const next = str.slice(1);
      o[sym].push(next);
    }
    return o;
  }, {});
}

function _recurse(arr: any) {
  const obj = _getGroups(arr);
  Object.entries(obj).forEach(([key, a]) => {
    const newArr = [...(a as any)];
    const newObj = _recurse(newArr);
    if (Object.values(newObj).length === 1) {
      delete obj[key];
      let sym = Object.keys(newObj)[0];
      const data = newObj[sym];
      const newKey = `${key}${sym}`;
      obj[newKey] = data;
    } else {
      obj[key] = newObj;
    }
  });

  return Object.keys(obj).length === 0 ? "`" : obj;
}

function _addValues(obj: any, str = "", startObj: any) {
  Object.entries(obj).forEach(([key, o]) => {
    const s = `${str}${key === "*0" ? "" : key}`;
    if (o === "`") {
      delete obj[key];
      const newKey = key.slice(0, -1);
      const title = key === "*0" ? s : s.slice(0, -1);
      const id = startObj[title];
      obj[newKey] = {
        ready: true,
        id,
      };
    } else {
      obj[key] = _addValues(o, s, startObj);
    }
  });
  return obj;
}

export function getGraph(startObj: any) {
  const arr = Object.keys(startObj);
  arr.sort();
  const obj = _recurse(arr);
  const values = _addValues(obj, "", startObj);

  return values;
}
