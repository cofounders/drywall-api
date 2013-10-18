requirejs(['app/controllers/login.js', 'app/models/login.js'], 
function (controller, model) {
  describe("login controller", function() {
    it("Should have a property, `github`..", function() {
      var hasGithub = controller.hasOwnProperty('github');
      expect(hasGithub).toBe(true);
      var Github = controller.github;
      expect(Github).toBeDefined();
    });
    it("..which is an object describing two functions, authorize and redirect..", function() {
      var hasAuthorize = controller.github.hasOwnProperty('authorize');
      expect(hasAuthorize).toBe(true);
      var typeAuthorize = typeof(controller.github.authorize);
      expect(typeAuthorize).toEqual("function");

      var hasRedirect = controller.github.hasOwnProperty('redirect');
      expect(hasRedirect).toBe(true);
      var typeRedirect = typeof(controller.github.redirect);
      expect(typeRedirect).toEqual("function");
    });
  });
  describe("login model", function(){
    it("should define an instance method make", function(){
      var hasMake = model.hasOwnProperty('make');
      expect(hasMake).toEqual(true);
    });
  });
});
