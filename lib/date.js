Date.prototype.getNow = function() {
  var offset = (this.getTimezoneOffset() / 60) * -1;
  return new Date(this.getTime() + offset);
};