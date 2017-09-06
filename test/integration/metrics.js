const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../server');
const promClient = require('../../app/lib/promBundle').promClient;

const expect = chai.expect;
chai.use(chaiHttp);

describe('metrics end point', () => {
  let responseText;

  before('make request to /metrics endpoint', (done) => {
    chai.request(app)
      .get('/metrics')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        responseText = res.text;
        done();
      });
  });

  it('should return an up gauge', () => {
    expect(responseText).to.have.string('# HELP up 1 = up, 0 = not up\n# TYPE up gauge\nup 1');
  });

  it('should return an http_request_duration_seconds histogram', () => {
    expect(responseText).to.have.string('# HELP http_request_duration_seconds duration histogram of http responses labeled with: status_code, path\n# TYPE http_request_duration_seconds histogram');
  });

  it('should return an app_start counter', () => {
    expect(responseText).to.have.string('# HELP app_start times the application has been started\n# TYPE app_start counter\napp_start 0');
  });

  it('should return a not_found counter', () => {
    expect(responseText).to.have.string('# HELP not_found not found page has been returned\n# TYPE not_found counter\nnot_found');
  });

  it('should return a gp_profile counter', () => {
    expect(responseText).to.have.string('# HELP gp_profile GP profile has been returned\n# TYPE gp_profile counter\ngp_profile');
  });

  it('should return an error counter', () => {
    expect(responseText).to.have.string('# HELP error error page has been returned\n# TYPE error counter\nerror');
  });

  it('should return an the default metrics', () => {
    expect(responseText).to.have.string('# HELP process_cpu_user_seconds_total Total user CPU time spent in seconds.\n# TYPE process_cpu_user_seconds_total counter');
    expect(responseText).to.have.string('# HELP process_cpu_system_seconds_total Total system CPU time spent in seconds.\n# TYPE process_cpu_system_seconds_total counter');
    expect(responseText).to.have.string('# HELP process_cpu_seconds_total Total user and system CPU time spent in seconds.\n# TYPE process_cpu_seconds_total counter');
    expect(responseText).to.have.string('# HELP process_start_time_seconds Start time of the process since unix epoch in seconds.\n# TYPE process_start_time_seconds gauge');
    expect(responseText).to.have.string('# HELP process_resident_memory_bytes Resident memory size in bytes.\n# TYPE process_resident_memory_bytes gauge');
    expect(responseText).to.have.string('# HELP process_virtual_memory_bytes Virtual memory size in bytes.\n# TYPE process_virtual_memory_bytes gauge');
    expect(responseText).to.have.string('# HELP process_heap_bytes Process heap size in bytes.\n# TYPE process_heap_bytes gauge');
    expect(responseText).to.have.string('# HELP process_open_fds Number of open file descriptors.\n# TYPE process_open_fds gauge');
    expect(responseText).to.have.string('# HELP process_max_fds Maximum number of open file descriptors.\n# TYPE process_max_fds gauge');
    expect(responseText).to.have.string('# HELP nodejs_eventloop_lag_seconds Lag of event loop in seconds.\n# TYPE nodejs_eventloop_lag_seconds gauge');
    expect(responseText).to.have.string('# HELP nodejs_active_handles_total Number of active handles.\n# TYPE nodejs_active_handles_total gauge');
    expect(responseText).to.have.string('# HELP nodejs_active_requests_total Number of active requests.\n# TYPE nodejs_active_requests_total gauge');
    expect(responseText).to.have.string('# HELP nodejs_heap_size_total_bytes Process heap size from node.js in bytes.\n# TYPE nodejs_heap_size_total_bytes gauge');
    expect(responseText).to.have.string('# HELP nodejs_heap_size_used_bytes Process heap size used from node.js in bytes.\n# TYPE nodejs_heap_size_used_bytes gauge');
    expect(responseText).to.have.string('# HELP nodejs_external_memory_bytes Nodejs external memory size in bytes.\n# TYPE nodejs_external_memory_bytes gauge');
    expect(responseText).to.have.string('# HELP nodejs_heap_space_size_total_bytes Process heap space size total from node.js in bytes.\n# TYPE nodejs_heap_space_size_total_bytes gauge');
    expect(responseText).to.have.string('# HELP nodejs_heap_space_size_used_bytes Process heap space size used from node.js in bytes.\n# TYPE nodejs_heap_space_size_used_bytes gauge');
    expect(responseText).to.have.string('# HELP nodejs_heap_space_size_available_bytes Process heap space size available from node.js in bytes.\n# TYPE nodejs_heap_space_size_available_bytes gauge');
    expect(responseText).to.have.string('# HELP nodejs_version_info Node.js version info.\n# TYPE nodejs_version_info gauge');
  });

  afterEach('clear metrics', () => {
    // Clear the metrics created when the app starts to avoid reports of:
    // Error: A metric with the name up has already been registered.
    promClient.register.clear();
  });
});
