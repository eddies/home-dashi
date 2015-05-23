'use strict';

/* jshint globalstrict: true */
/* global dc,d3,crossfilter */

// ### Create Chart Objects
// Create chart objects assocated with the container elements identified by the 
// css selector.
// Note: It is often a good idea to have these objects accessible at the global 
// scope so that they can be modified or filtered by other page controls.
var case_opening_dtChart = dc.barChart('#case_opening_dt-chart', 'non-domestic');
var case_closing_dtChart = dc.barChart('#case_closing_dt-chart', 'non-domestic');
var casests_codeChart = dc.rowChart('#casests_code-chart', 'non-domestic');

var agency_nmChart = dc.rowChart('#agency_nm-chart', 'non-domestic');
var sg_arrival_dateChart = dc.barChart('#sg_arrival_date-chart', 'non-domestic');
var sg_stay_total_daysChart = dc.barChart('#sg_stay_total_days-chart', 'non-domestic');
var start_working_dtChart = dc.barChart('#start_working_dt-chart', 'non-domestic');

var ageChart = dc.barChart('#age-chart', 'non-domestic');
var edulvl_codeChart = dc.rowChart('#edulvl_code-chart', 'non-domestic');
var genderChart = dc.pieChart('#gender-chart', 'non-domestic');
var marists_codeChart = dc.rowChart('#marists_code-chart', 'non-domestic');
var martsts_dpdntsChart = dc.barChart('#martsts_dpdnts-chart', 'non-domestic');
var natl_codeChart = dc.rowChart('#natl_code-chart', 'non-domestic');
var relg_codeChart = dc.rowChart('#relg_code-chart', 'non-domestic');

// non-domestic only fields
var abuseChart = dc.rowChart('#abuse-chart', 'non-domestic');
var industryChart = dc.barChart('#industry-chart', 'non-domestic');
var non_domestic_salaryChart = dc.barChart('#non_domestic_salary-chart', 'non-domestic');

// ### Anchor Div for Charts
/*
// A div anchor that can be identified by id
    <div id='your-chart'></div>
// Title or anything you want to add above the chart
    <div id='chart'><span>Days by Gain or Loss</span></div>
// ##### .turnOnControls()
// If a link with css class 'reset' is present then the chart
// will automatically turn it on/off based on whether there is filter
// set on this chart (slice selection for pie chart and brush
// selection for bar chart). Enable this with `chart.turnOnControls(true)`
     <div id='chart'>
       <a class='reset' href='javascript:myChart.filterAll();dc.redrawAll();' style='display: none;'>reset</a>
     </div>
// dc.js will also automatically inject applied current filter value into
// any html element with css class set to 'filter'
    <div id='chart'>
        <span class='reset' style='display: none;'>Current filter: <span class='filter'></span></span>
    </div>
*/




/**
 * @param rows - An array of of objects representing the parsed rows of d3.csv.
 */
function parseDateTimes(rows) {
  var dateFormat = d3.time.format('%Y-%m-%d');
  var dateTimeFormat = d3.time.format('%Y-%m-%d %H:%M:%S');
  //var numberFormat = d3.format('.2f');
  
  rows.forEach(function (d) {
    d.case_opening_dt = d.case_opening_dt ? dateTimeFormat.parse(d.case_opening_dt) : Infinity;
    d.case_closing_dt = d.case_closing_dt ? dateTimeFormat.parse(d.case_closing_dt) : Infinity;
    d.created_on = d.created_on ? dateTimeFormat.parse(d.created_on) : Infinity;
    d.modified_on = d.modified_on ? dateTimeFormat.parse(d.modified_on) : Infinity;
    d.sg_arrival_date = d.sg_arrival_date ? dateTimeFormat.parse(d.sg_arrival_date) : Infinity;
    d.start_working_dt = d.start_working_dt ? dateFormat.parse(d.start_working_dt) : Infinity;
  });
}

/**
 * Returns the age given the birth year (e.g. 1991).
 * Returns null if birth_year is undefined, null, empty string, or 0.
 * 
 * @param {string} birth year - year of birth (e.g. "1991")
 */
function getAge(birth_year) {
  if (!!birth_year) {
    return new Date().getFullYear() - parseInt(birth_year);
  } else {
    return null;
  }
}

// ### Load your data
// Data can be loaded through regular means with your
// favorite javascript library, e.g.:
//   d3.csv('data.csv', function(data) {...};
//   d3.json('data.json', function(data) {...};
//   jQuery.getJson('data.json', function(data){...});
d3.csv('data/non-domestic.csv', function (rows) {
  parseDateTimes(rows);

  // ### Create Crossfilter Dimensions and Groups
  // See the [crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference)
  // for reference.
  var cf = crossfilter(rows);
  var all = cf.groupAll();

  var case_opening_dt_dim = cf.dimension(function (d) { return d.case_opening_dt; });
  var case_closing_dt_dim = cf.dimension(function (d) { return d.case_closing_dt; });
  var sg_arrival_date_dim = cf.dimension(function (d) { return d.sg_arrival_date; });
  var start_working_dt_dim = cf.dimension(function (d) { return d.start_working_dt; });
  var case_opening_dt_dimGroup = case_opening_dt_dim.group(function (d) { return isFinite(d) ? d3.time.month(d) : 'NaN'; });
  var case_closing_dt_dimGroup = case_closing_dt_dim.group(function (d) { return isFinite(d) ? d3.time.month(d) : 'NaN'; });
  var sg_arrival_date_dimGroup = sg_arrival_date_dim.group(function (d) { return isFinite(d) ? d3.time.month(d) : 'NaN'; });
  var start_working_dt_dimGroup = start_working_dt_dim.group(function (d) { return isFinite(d) ? d3.time.month(d) : 'NaN'; });

  var relg_code_dim = cf.dimension(function (d) { return d.relg_code; });
  var martsts_dpdnts_dim = cf.dimension(function (d) { return d.martsts_dpdnts; });
  var sg_stay_total_days_dim = cf.dimension(function (d) { var r = d.sg_stay_total_days / 365.0; return r>4.5 ? 4.5:r; });
  var agency_nm_dim = cf.dimension(function (d) { return d.agency_nm; });
  var relg_code_dimGroup = relg_code_dim.group();
  var martsts_dpdnts_dimGroup = martsts_dpdnts_dim.group();
  var sg_stay_total_days_dimGroup = sg_stay_total_days_dim.group();
  var agency_nm_dimGroup = agency_nm_dim.group();

  var industry_dim = cf.dimension(function (d) {return d.indsttp_code; });
  var industry_dimGroup = industry_dim.group();

  var gender_dim = cf.dimension(function (d) { return d.gender; });
  var edulvl_code_dim = cf.dimension(function (d) { return d.edulvl_code; });
  var marists_code_dim = cf.dimension(function (d) { return d.marists_code; });
  var natl_code_dim = cf.dimension(function (d) { return d.natl_code; });
  var casests_code_dim = cf.dimension(function (d) { return d.casests_code; });
  var gender_dimGroup = gender_dim.group();
  var edulvl_code_dimGroup = edulvl_code_dim.group();
  var marists_code_dimGroup = marists_code_dim.group();
  var natl_code_dimGroup = natl_code_dim.group();
  var casests_code_dimGroup = casests_code_dim.group();

  var abuse_dim = cf.dimension(function (d) {
  	if (d.assault_tick === 'Y') { return 'assault'; }
  	if (d.verbal_abuse_tick === 'Y') { return 'verbal_abuse'; }
  	if (d.repatriation_threat_tick === 'Y') { return 'repatriation_threat'; }
  	if (d.deploy_cross_sector_tick === 'Y') { return 'deploy_cross_sector'; }
  	if (d.deploy_intra_sector_tick === 'Y') { return 'deploy_intra_sector'; }
  	if (d.dismissed_from_job_tick === 'Y') { return 'dismissed_from_job'; }
  	if (d.occupation_diff_from_wp_tick === 'Y') { return 'occupation_diff_from_wp'; }
    if (d.salary_unpaid_tick === 'Y') { return 'salary_unpaid'; }
  	if (d.salary_late_tick === 'Y') { return 'salary_late'; }
  	if (d.salary_ot15_tick === 'Y') { return 'salary_ot15'; }
  	if (d.salary_holiday_pay_tick === 'Y') { return 'salary_holiday_pay'; }
  	if (d.salary_rest_day_pay_tick === 'Y') { return 'salary_rest_day_pay'; }
  	if (d.salary_promised_diff_tick === 'Y') { return 'salary_promised_diff'; }
  	if (d.deduct_work_permit_renewal_tick === 'Y') { return 'deduct_work_permit_renewal'; }
  	if (d.deduct_agent_fee_tick === 'Y') { return 'deduct_agent_fee'; }
    if (d.deduct_levy_tick === 'Y') { return 'deduct_levy'; }
    if (d.deduct_insurance_premium_tick === 'Y') { return 'deduct_insurance_premium'; }
    if (d.deduct_safety_effects_tick === 'Y') { return 'deduct_safety_effects'; }
    if (d.deduct_breach_of_contract_tick === 'Y') { return 'deduct_breach_of_contract'; }    
    if (d.deduct_security_deposit_tick === 'Y') { return 'deduct_security_deposit'; }
    if (d.workacc_not_reported_tick === 'Y') { return 'workacc_not_reported'; }
    // incomplete
    
  	if (d.other_issues_tick === 'Y') { return 'other'; }
  	return 'none';
  });
  var abuse_dimGroup = abuse_dim.group();

  var age_dim = cf.dimension(function (d) { 
      return getAge(d.birth_dt); 
  });
  var age_dimGroup = age_dim.group(function (d) {
  		return isFinite(d) ? Math.round(d/5)*5 : null;
  	});

  var non_domestic_salary_dim = cf.dimension(function(e){
  	var d = Math.round(e.basic_salary_in_SGD_hour);

  	if (!isFinite(d) || isNaN(d)) { return 'NA'; }
  	if (d <= 10) {
      return d.toString();
  	} else {
      return '10+';
    }
  });
  var non_domestic_salary_dimGroup = non_domestic_salary_dim.group();
  var non_domestic_salary_name = ['NA', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '10+'];

  genderChart.dimension(gender_dim).group(gender_dimGroup)
    .radius(80)
    .label(function (d) {
      if (genderChart.hasFilter() && !genderChart.hasFilter(d.key)) {
          return d.key + '(0%)';
      }
      var label = d.key;
      if (all.value()) {
          label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
      }
      return label;  
    })
      ;
  edulvl_codeChart.dimension(edulvl_code_dim).group(edulvl_code_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 10})
  	.width($(edulvl_codeChart.root()[0]).parent().width())
  	.height(200)
  	.elasticX(true)
  	.xAxis().ticks(4)
      ;
  edulvl_codeChart.data(function(group){
  	return group.top(5);
  });
  marists_codeChart.dimension(marists_code_dim).group(marists_code_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 10})
  	.width($(marists_codeChart.root()[0]).parent().width())
  	.height(200)
  	.elasticX(true)
  	.xAxis().ticks(4)
      ;
  marists_codeChart.data(function(group){
  	return group.top(5);
  });

  ageChart.dimension(age_dim).group(age_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 40})
  	.width($(ageChart.root()[0]).parent().width())
  	.height(200)
      .x(d3.scale.linear().domain([15,60]))
      .elasticY(true)
  	.gap(-30)
  	.xAxis().ticks(4)
      ;

  relg_codeChart.dimension(relg_code_dim).group(relg_code_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 10})
  	.width($(relg_codeChart.root()[0]).parent().width())
  	.height(200)
  	.elasticX(true)
  	.xAxis().ticks(4)
      ;
  relg_codeChart.data(function(group){
  	return group.top(5);
  });
  martsts_dpdntsChart.dimension(martsts_dpdnts_dim).group(martsts_dpdnts_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 40})
  	.width($(martsts_dpdntsChart.root()[0]).parent().width())
  	.height(200)
  	//.gap(70)
  	.x(d3.scale.linear().domain([0,5]))
      .elasticY(true)
  	.xAxis().ticks(4)
      ;
  sg_stay_total_daysChart.dimension(sg_stay_total_days_dim).group(sg_stay_total_days_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 40})
  	.width($(sg_stay_total_daysChart.root()[0]).parent().width())
  	.height(200)
  	.gap(70)
  	.x(d3.scale.linear().domain([0,5]))
      .elasticY(true)
      ;
  agency_nmChart.dimension(agency_nm_dim).group(agency_nm_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 10})
  	.width($(agency_nmChart.root()[0]).parent().width())
  	.height(200)
  	.elasticX(true)
  	.xAxis().ticks(4)
      ;
  agency_nmChart.data(function(group){
  	return group.top(5);
  });

  natl_codeChart.dimension(natl_code_dim).group(natl_code_dimGroup)
  	//.margins({top: 10, right: 10, bottom: 30, left: 10})
  	.width($(natl_codeChart.root()[0]).parent().width())
  	.height(400)
  	.elasticX(true)
  	.xAxis().ticks(4)
      ;
  natl_codeChart.data(function(group){
  	return group.top(8);
  });

  casests_codeChart.dimension(casests_code_dim).group(casests_code_dimGroup)
  	//.margins({top: 10, right: 10, bottom: 30, left: 10})
  	.width($(casests_codeChart.root()[0]).parent().width())
  	.height(400)
  	.elasticX(true)
  	.gap(1)
  	.xAxis().ticks(4)
      ;
  casests_codeChart.data(function(group){
  	return group.top(8);
  });

  abuseChart.dimension(abuse_dim).group(abuse_dimGroup)
  	//.margins({top: 10, right: 10, bottom: 30, left: 10})
  	.width($(abuseChart.root()[0]).parent().width())
  	.height(400)
  	.elasticX(true)
  	.gap(1)
    .label(function (d) {
      if (abuseChart.hasFilter() && !abuseChart.hasFilter(d.key)) {
        return d.key + ' (0%)';
      }
      var label = d.key;
      if (all.value()) {
        label += ' (' + Math.floor(d.value / all.value() * 100) + '%)';
      }
      return label;
    })
  	.xAxis().ticks(4)
      ;
  abuseChart.data(function(group){
  	return group.top(8);
  });

  case_opening_dtChart.dimension(case_opening_dt_dim).group(case_opening_dt_dimGroup)
  	.width($(case_opening_dtChart.root()[0]).parent().width())
  	.height(150)
      .x(d3.time.scale().domain([new Date(2011, 0, 1), new Date(2014, 0, 1)]))
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .elasticY(true)
      ;
  case_closing_dtChart.dimension(case_closing_dt_dim).group(case_closing_dt_dimGroup)
    .margins({top: 10, right: 10, bottom: 30, left: 40})
  	.width($(case_closing_dtChart.root()[0]).parent().width())
  	.height(150)
      .x(d3.time.scale().domain([new Date(2011, 0, 1), new Date(2014, 0, 1)]))
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .elasticY(true)
      ;
  sg_arrival_dateChart.dimension(sg_arrival_date_dim).group(sg_arrival_date_dimGroup)
  	.width($(sg_arrival_dateChart.root()[0]).parent().width())
  	.height(150)
      .x(d3.time.scale().domain([new Date(2011, 0, 1), new Date(2014, 0, 1)]))
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .elasticY(true)
      ;
  start_working_dtChart.dimension(start_working_dt_dim).group(start_working_dt_dimGroup)
    .margins({top: 10, right: 10, bottom: 30, left: 40})
  	.width($(start_working_dtChart.root()[0]).parent().width())
  	.height(150)
      .x(d3.time.scale().domain([new Date(2011, 0, 1), new Date(2014, 0, 1)]))
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .elasticY(true)
      ;

  industryChart.dimension(industry_dim).group(industry_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 40})
  	.width($(industryChart.root()[0]).parent().width())
  	.height(200)
      .x(d3.scale.ordinal().domain(industry_dimGroup))
      .xUnits(dc.units.ordinal)
      .elasticY(true)
  	.xAxis().ticks(4)
      ;

  non_domestic_salaryChart.dimension(non_domestic_salary_dim).group(non_domestic_salary_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 40})
  	.width($(non_domestic_salaryChart.root()[0]).parent().width())
  	.height(200)
      .x(d3.scale.ordinal().domain(non_domestic_salary_name))
      .xUnits(dc.units.ordinal)
      .elasticY(true)
  	.xAxis().ticks(4)
      ;
      
  /*
  //#### Data Count
  // Create a data count widget and use the given css selector as anchor. You can also specify
  // an optional chart group for this chart to be scoped within. When a chart belongs
  // to a specific group then any interaction with such chart will only trigger redraw
  // on other charts within the same chart group.
  <div id='data-count'>
      <span class='filter-count'></span> selected out of <span class='total-count'></span> records
  </div>
  */
  dc.dataCount('#data-count', 'non-domestic')
    .dimension(cf)
    .group(all)
    // (optional) html, for setting different html for some records and all records.
    // .html replaces everything in the anchor with the html given using the following function.
    // %filter-count and %total-count are replaced with the values obtained.
    .html({
      some:'<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
        ' | <a href=\"javascript:dc.filterAll(\'non-domestic\'); dc.renderAll(\'non-domestic\');\">Reset All</a>',
      all:'All records selected. Please click on the graph to apply filters.'
    });
    
  /*
  //#### Data Table
  // Create a data table widget and use the given css selector as anchor. You can also specify
  // an optional chart group for this chart to be scoped within. When a chart belongs
  // to a specific group then any interaction with such chart will only trigger redraw
  // on other charts within the same chart group.
  <!-- anchor div for data table -->
  <div id='data-table'>
      <!-- create a custom header -->
      <div class='header'>
          <span>Date</span>
          <span>Open</span>
          <span>Close</span>
          <span>Change</span>
          <span>Volume</span>
      </div>
      <!-- data rows will filled in here -->
  </div>
  */
  dc.dataTable('#data-table', 'non-domestic')
    .dimension(case_opening_dt_dim)
    // data table does not use crossfilter group but rather a closure
    // as a grouping function
    .group(function (d) {
      var format = d3.format('02d');
      return d.case_opening_dt.getFullYear() + '/' + format((d.case_opening_dt.getMonth() + 1));
    })
    .size(20) // (optional) max number of records to be shown, :default = 25
    // There are several ways to specify the columns; see the data-table documentation.
    // This code demonstrates generating the column header automatically based on the columns.
    .columns([
      'date',    // d['date'], ie, a field accessor; capitalized automatically
      'gender',   // ...
      {
        label: 'Duration (years)', // desired format of column name 'Change' when used as a label with a function.
        format: function (d) {
          var numberFormat = d3.format('.2f');
          return numberFormat(d.sg_stay_total_days / 365.0);
        }
      },
      'indsttp_code'
    ])

    // (optional) sort using the given field, :default = function(d){return d;}
    .sortBy(function (d) {
      return d.case_opening_dt;
    })
    // (optional) sort order, :default ascending
    .order(d3.ascending)
    // (optional) custom renderlet to post-process chart using D3
    .on('renderlet.n', function (table) {
      table.selectAll('.dc-table-group').classed('info', true);
    });
  

  //#### Rendering
  //simply call renderAll() to render all charts on the page
  dc.renderAll('non-domestic');
  /*
  // or you can render charts belong to a specific chart group
  dc.renderAll('group');
  // once rendered you can call redrawAll to update charts incrementally when data
  // change without re-rendering everything
  dc.redrawAll();
  // or you can choose to redraw only those charts associated with a specific chart group
  dc.redrawAll('group');
  */
});