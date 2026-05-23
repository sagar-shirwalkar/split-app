(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  var groupId = request.pathParams.groupId;
  var body = request.body.data;
  body.group = groupId;
  var processor = new x_snc_split.SettlementProcessor();
  processor.recordSettlement(body);
  return { status: "recorded" };
})(request, response);
