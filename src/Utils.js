function checkNotNull(obj)
{
   if (!obj) throw new Error("Null argument.");
   return obj;
}

Array.prototype.pushUnique = function(element)
{
   if (this.indexOf(element) < 0) {
      this.push(element);
   }
};
