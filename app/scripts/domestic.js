'use strict';

/* jshint globalstrict: true */
/* global dc,d3,crossfilter */

// ### Create Chart Objects
// Create chart objects assocated with the container elements identified by the 
// css selector.
// Note: It is often a good idea to have these objects accessible at the global 
// scope so that they can be modified or filtered by other page controls.
var d_case_opening_dtChart = dc.barChart('#d_case_opening_dt-chart');
var d_case_closing_dtChart = dc.barChart('#d_case_closing_dt-chart');
var d_created_onChart = dc.barChart('#d_created_on-chart');
var d_modified_onChart = dc.barChart('#d_modified_on-chart');
var d_casests_codeChart = dc.rowChart('#d_casests_code-chart');

var d_agency_nmChart = dc.rowChart('#d_agency_nm-chart');
var d_sg_arrival_dateChart = dc.barChart('#d_sg_arrival_date-chart');
var d_sg_stay_total_daysChart = dc.barChart('#d_sg_stay_total_days-chart');
var d_start_working_dtChart = dc.barChart('#d_start_working_dt-chart');

var d_ageChart = dc.barChart('#d_age-chart');
var d_edulvl_codeChart = dc.rowChart('#d_edulvl_code-chart');
var d_genderChart = dc.pieChart('#d_gender-chart');
var d_marists_codeChart = dc.rowChart('#d_marists_code-chart');
var d_martsts_dpdntsChart = dc.barChart('#d_martsts_dpdnts-chart');
var d_natl_codeChart = dc.rowChart('#d_natl_code-chart');
var d_relg_codeChart = dc.rowChart('#d_relg_code-chart');

// domestic-only fields
var d_abuseChart = dc.rowChart('#d_abuse-chart');
var d_day_off_per_mthChart = dc.barChart('#d_day_off_per_mth-chart');
var d_stay_durationChart = dc.barChart('#d_stay_duration-chart');
var d_total_sal_pm_domesticChart = dc.barChart('#d_total_sal_pm_domestic-chart');


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
d3.csv('data/domestic.csv', function (rows) {
  parseDateTimes(rows);

  // ### Create Crossfilter Dimensions and Groups
  // See the [crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference)
  // for reference.
  var cf = crossfilter(rows);
  var all = cf.groupAll();

  var case_opening_dt_dim = cf.dimension(function (d) { return d.case_opening_dt; });
  var case_closing_dt_dim = cf.dimension(function (d) { return d.case_closing_dt; });
  var created_on_dim = cf.dimension(function (d) { return d.created_on; });
  var modified_on_dim = cf.dimension(function (d) { return d.modified_on; });
  var sg_arrival_date_dim = cf.dimension(function (d) { return d.sg_arrival_date; });
  var start_working_dt_dim = cf.dimension(function (d) { return d.start_working_dt; });
  var case_opening_dt_dimGroup = case_opening_dt_dim.group(function (d) { return isFinite(d) ? d3.time.month(d) : 'NaN'; });
  var case_closing_dt_dimGroup = case_closing_dt_dim.group(function (d) { return isFinite(d) ? d3.time.month(d) : 'NaN'; });
  var created_on_dimGroup = created_on_dim.group(function (d) { return isFinite(d) ? d3.time.month(d) : 'NaN'; });
  var modified_on_dimGroup = modified_on_dim.group(function (d) { return isFinite(d) ? d3.time.month(d) : 'NaN'; });
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

  var total_sal_pm_domestic_dim = cf.dimension(function(e){
  	var d = e.total_sal_pm_domestic;
  	if (!isFinite(d)) { return d; }
  	//if (d < 0) return '< 0';
  	if (d === 0) { return '0'; }
  	if (d < 100) { return '' + (100-99) + ' - ' + (100); }
  	if (d < 200) { return '' + (200-99) + ' - ' + (200); }
  	if (d < 300) { return '' + (300-99) + ' - ' + (300); }
  	if (d < 400) { return '' + (400-99) + ' - ' + (400); }
  	if (d < 500) {
      return '' + (500-99) + ' - ' + (500);
    } else {
      return '> 500';
    }
  });
  var total_sal_pm_domestic_dimGroup = total_sal_pm_domestic_dim.group();
  var total_sal_pm_domestic_names = ['0', '' + (100-99) + '' - '' + (100), '' + 
                                    (200-99) + ' - ' + (200), '' + (300-99) + 
                                    ' - ' + (300), '' + (400-99) + ' - ' + 
                                    (400), '' + (500-99) + ' - ' + (500), '> 500'];

  var abuse_dim = cf.dimension(function (d) {
  	if (d.physical_abuse_tick === 'Y') { return 'physical_abuse'; }
  	if (d.emotional_abuse_tick === 'Y') { return 'emotional_abuse'; }
  	if (d.sexual_abuse_tick === 'Y') { return 'sexual_abuse'; }
  	if (d.illegal_deploy_tick === 'Y') { return 'illegal_deploy'; }
    if (d.salary_no_pay_tick === 'Y') { return 'salary_no_pay'; }
    if (d.withheld_wages_tick === 'Y') { return 'withheld_wages'; }
    if (d.deduction_from_wages_tick === 'Y') { return 'deduction_from_wages'; }
    if (d.medical_related_tick === 'Y') { return 'medical_related'; }
    if (d.poor_living_cond_tick === 'Y') { return 'poor_living_cond'; }
    if (d.issues_with_agent_tick === 'Y') { return 'issues_with_agent'; }
  	if (d.overwork_tick === 'Y') { return 'overwork'; }
    if (d.safety_at_workplace_tick === 'Y') { return 'safety_at_workplace'; }
    if (d.insufficient_food_tick === 'Y') { return 'insufficient_food'; }
  	if (d.dismissed_from_job_tick === 'Y') { return 'dismissed_from_job'; }
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

  var stay_duration_dim = cf.dimension(function(e){
  	var d = Math.round(e.sg_stay_duration / 30);

  	if (!isFinite(d) || isNaN(d)) { return 'NA'; }
  	if (d <= 12) {
      return d.toString();
    } else {
      return '12+';
    }
  });
  var stay_duration_dimGroup = stay_duration_dim.group();
  var stay_duration_name = ['NA', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '12+'];

  var day_off_per_mth_dim = cf.dimension(function(d) { return d.day_off_per_mth; });
  var day_off_per_mth_dimGroup = day_off_per_mth_dim.group();

  d_genderChart.dimension(gender_dim).group(gender_dimGroup)
    .radius(80)
    .label(function (d) {
      if (d_genderChart.hasFilter() && !d_genderChart.hasFilter(d.key)) {
          return d.key + '(0%)';
      }
      var label = d.key;
      if (all.value()) {
          label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
      }
      return label;  
    })
      ;
  d_edulvl_codeChart.dimension(edulvl_code_dim).group(edulvl_code_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 10})
  	.width($(d_edulvl_codeChart.root()[0]).parent().width())
  	.height(200)
  	.elasticX(true)
  	.xAxis().ticks(4)
      ;
  d_edulvl_codeChart.data(function(group){
  	return group.top(5);
  });
  d_marists_codeChart.dimension(marists_code_dim).group(marists_code_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 10})
  	.width($(d_marists_codeChart.root()[0]).parent().width())
  	.height(200)
  	.elasticX(true)
  	.xAxis().ticks(4)
      ;
  d_marists_codeChart.data(function(group){
  	return group.top(5);
  });

  d_ageChart.dimension(age_dim).group(age_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 40})
  	.width($(d_ageChart.root()[0]).parent().width())
  	.height(200)
      .x(d3.scale.linear().domain([15,60]))
      .elasticY(true)
  	.gap(-30)
  	.xAxis().ticks(4)
      ;

  d_total_sal_pm_domesticChart.dimension(total_sal_pm_domestic_dim).group(total_sal_pm_domestic_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 40})
  	.width($(d_total_sal_pm_domesticChart.root()[0]).parent().width())
  	.height(200)
      .x(d3.scale.ordinal().domain(total_sal_pm_domestic_names))
      .xUnits(dc.units.ordinal)
      .elasticY(true)
  	.xAxis().ticks(4)
      ;

  d_relg_codeChart.dimension(relg_code_dim).group(relg_code_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 10})
  	.width($(d_relg_codeChart.root()[0]).parent().width())
  	.height(200)
  	.elasticX(true)
  	.xAxis().ticks(4)
      ;
  d_relg_codeChart.data(function(group){
  	return group.top(5);
  });
  d_martsts_dpdntsChart.dimension(martsts_dpdnts_dim).group(martsts_dpdnts_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 40})
  	.width($(d_martsts_dpdntsChart.root()[0]).parent().width())
  	.height(200)
  	//.gap(70)
  	.x(d3.scale.linear().domain([0,5]))
      .elasticY(true)
  	.xAxis().ticks(4)
      ;
  d_sg_stay_total_daysChart.dimension(sg_stay_total_days_dim).group(sg_stay_total_days_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 40})
  	.width($(d_sg_stay_total_daysChart.root()[0]).parent().width())
  	.height(200)
  	.gap(70)
  	.x(d3.scale.linear().domain([0,5]))
      .elasticY(true)
      ;
  d_agency_nmChart.dimension(agency_nm_dim).group(agency_nm_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 10})
  	.width($(d_agency_nmChart.root()[0]).parent().width())
  	.height(200)
  	.elasticX(true)
  	.xAxis().ticks(4)
      ;
  d_agency_nmChart.data(function(group){
  	return group.top(5);
  });

  d_natl_codeChart.dimension(natl_code_dim).group(natl_code_dimGroup)
  	//.margins({top: 10, right: 10, bottom: 30, left: 10})
  	.width($(d_natl_codeChart.root()[0]).parent().width())
  	.height(200)
  	.elasticX(true)
  	.xAxis().ticks(4)
      ;
  d_natl_codeChart.data(function(group){
  	return group.top(8);
  });

  d_casests_codeChart.dimension(casests_code_dim).group(casests_code_dimGroup)
  	//.margins({top: 10, right: 10, bottom: 30, left: 10})
  	.width($(d_casests_codeChart.root()[0]).parent().width())
  	.height(200)
  	.elasticX(true)
  	.gap(1)
  	.xAxis().ticks(4)
      ;
  d_casests_codeChart.data(function(group){
  	return group.top(8);
  });

  d_abuseChart.dimension(abuse_dim).group(abuse_dimGroup)
  	//.margins({top: 10, right: 10, bottom: 30, left: 10})
  	.width($(d_abuseChart.root()[0]).parent().width())
  	.height(200)
  	.elasticX(true)
  	.gap(1)
    .label(function (d) {
      if (d_abuseChart.hasFilter() && !d_abuseChart.hasFilter(d.key)) {
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
  d_abuseChart.data(function(group){
  	return group.top(8);
  });

  d_case_opening_dtChart.dimension(case_opening_dt_dim).group(case_opening_dt_dimGroup)
  	.width($(d_case_opening_dtChart.root()[0]).parent().width())
  	.height(150)
      .x(d3.time.scale().domain([new Date(2011, 0, 1), new Date(2014, 0, 1)]))
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .elasticY(true)
      ;
  d_case_closing_dtChart.dimension(case_closing_dt_dim).group(case_closing_dt_dimGroup)
    .margins({top: 10, right: 10, bottom: 30, left: 40})
  	.width($(d_case_closing_dtChart.root()[0]).parent().width())
  	.height(150)
      .x(d3.time.scale().domain([new Date(2011, 0, 1), new Date(2014, 0, 1)]))
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .elasticY(true)
      ;
  d_created_onChart.dimension(created_on_dim).group(created_on_dimGroup)
  	.width($(d_created_onChart.root()[0]).parent().width())
  	.height(150)
      .x(d3.time.scale().domain([new Date(2011, 0, 1), new Date(2014, 0, 1)]))
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .elasticY(true)
      ;
  d_modified_onChart.dimension(modified_on_dim).group(modified_on_dimGroup)
    .margins({top: 10, right: 10, bottom: 30, left: 40})
  	.width($(d_modified_onChart.root()[0]).parent().width())
  	.height(150)
      .x(d3.time.scale().domain([new Date(2011, 0, 1), new Date(2014, 0, 1)]))
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .elasticY(true)
      ;
  d_sg_arrival_dateChart.dimension(sg_arrival_date_dim).group(sg_arrival_date_dimGroup)
  	.width($(d_sg_arrival_dateChart.root()[0]).parent().width())
  	.height(150)
      .x(d3.time.scale().domain([new Date(2011, 0, 1), new Date(2014, 0, 1)]))
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .elasticY(true)
      ;
  d_start_working_dtChart.dimension(start_working_dt_dim).group(start_working_dt_dimGroup)
    .margins({top: 10, right: 10, bottom: 30, left: 40})
  	.width($(d_start_working_dtChart.root()[0]).parent().width())
  	.height(150)
      .x(d3.time.scale().domain([new Date(2011, 0, 1), new Date(2014, 0, 1)]))
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .elasticY(true)
      ;

  d_stay_durationChart.dimension(stay_duration_dim).group(stay_duration_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 40})
  	.width($(d_stay_durationChart.root()[0]).parent().width())
  	.height(200)
      .x(d3.scale.ordinal().domain(stay_duration_name))
      .xUnits(dc.units.ordinal)
      .elasticY(true)
  	.xAxis().ticks(4)
      ;

  d_day_off_per_mthChart.dimension(day_off_per_mth_dim).group(day_off_per_mth_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 40})
  	.width($(d_day_off_per_mthChart.root()[0]).parent().width())
  	.height(200)
      .x(d3.scale.ordinal().domain(day_off_per_mth_dimGroup))
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
  dc.dataCount('.dc-data-count')
    .dimension(cf)
    .group(all)
    // (optional) html, for setting different html for some records and all records.
    // .html replaces everything in the anchor with the html given using the following function.
    // %filter-count and %total-count are replaced with the values obtained.
    .html({
      some:'<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
        ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'\'>Reset All</a>',
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
  dc.dataTable('.dc-data-table')
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
      'gender',
      {
        label: 'Nationality',
        format: function(d) {
          return d.natl_code;
        }
      },
      {
        label: 'Duration (years)', // desired format of column name 'Change' when used as a label with a function.
        format: function (d) {
          var numberFormat = d3.format('.2f');
          return numberFormat(d.sg_stay_total_days / 365.0);
        }
      },
      
      'day_off_per_mth',
      'total_sal_pm_domestic'
    ])

    // (optional) sort using the given field, :default = function(d){return d;}
    .sortBy(function (d) {
      return d.case_opening_dt;
    })
    // (optional) sort order, :default ascending
    .order(d3.ascending)
    // (optional) custom renderlet to post-process chart using D3
    .on('renderlet.d', function (table) {
      table.selectAll('.dc-table-group').classed('info', true);
    });
  

  //#### Rendering
  //simply call renderAll() to render all charts on the page
  dc.renderAll();
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