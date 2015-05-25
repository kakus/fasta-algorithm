function makeRemoveClassHandler(regex) {
  return function (index, classes) {
      return classes.split(/\s+/).filter(function (el) {return regex.test(el);}).join(' ');
    }
}
