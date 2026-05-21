(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  var user = gs.getUserID();
  var gr = new GlideRecord("x_2053373_split_membership");
  gr.addQuery("user", user);
  gr.query();

  var groups = [];
  while (gr.next()) {
    var g = new GlideRecord("x_2053373_split_group");
    if (g.get(gr.group)) {
      groups.push({
        sys_id: g.getUniqueValue(),
        name: g.name.toString(),
        description: g.description.toString(),
        base_currency: g.base_currency.toString(),
        role: gr.role.toString(),
      });
    }
  }
  return groups;
})(request, response);
