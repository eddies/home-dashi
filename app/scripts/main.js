//# dc.js Getting Started and How-To Guide
'use strict';

/* jshint globalstrict: true */
/* global dc,d3,crossfilter,colorbrewer */

// ### Create Chart Objects
// Create chart objects assocated with the container elements identified by the 
// css selector.
// Note: It is often a good idea to have these objects accessible at the global 
// scope so that they can be modified or filtered by other page controls.
var case_opening_dtChart = dc.barChart('#case_opening_dt-chart');
var case_closing_dtChart = dc.barChart('#case_closing_dt-chart');
var created_onChart = dc.barChart('#created_on-chart');
var modified_onChart = dc.barChart('#modified_on-chart');
var sg_arrival_dateChart = dc.barChart('#sg_arrival_date-chart');
var start_working_dtChart = dc.barChart('#start_working_dt-chart');

var genderChart = dc.rowChart('#gender-chart');
var worker_tpChart = dc.rowChart('#worker_tp-chart');
var edulvl_codeChart = dc.rowChart('#edulvl_code-chart');
var marists_codeChart = dc.rowChart('#marists_code-chart');
var natl_codeChart = dc.rowChart('#natl_code-chart');

var abuseChart = dc.rowChart('#abuse-chart');
var ageChart = dc.barChart('#age-chart');
var total_sal_pm_domesticChart = dc.barChart('#total_sal_pm_domestic-chart');
var casests_codeChart = dc.rowChart('#casests_code-chart');

var relg_codeChart = dc.rowChart('#relg_code-chart');
var martsts_dpdntsChart = dc.barChart('#martsts_dpdnts-chart');
var sg_stay_total_daysChart = dc.barChart('#sg_stay_total_days-chart');
var agency_nmChart = dc.rowChart('#agency_nm-chart');

var industryChart = dc.barChart('#industry-chart');
var stay_durationChart = dc.barChart('#stay_duration-chart');
var non_domestic_salaryChart = dc.barChart('#non_domestic_salary-chart');
var day_off_per_mthChart = dc.barChart('#day_off_per_mth-chart');

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

// ### Load your data
// Data can be loaded through regular means with your
// favorite javascript library, e.g.:
//   d3.csv('data.csv', function(data) {...};
//   d3.json('data.json', function(data) {...};
//   jQuery.getJson('data.json', function(data){...});
d3.csv('data/home.csv', function (rows) {
    /* since its a csv file we need to format the data a bit */
  var dateFormat = d3.time.format('%Y-%m-%d');
  var dateTimeFormat = d3.time.format('%Y-%m-%d %H:%M:%S');
  var numberFormat = d3.format('.2f');
  
  rows.forEach(function (d) {
    d.case_opening_dt = d.case_opening_dt ? dateTimeFormat.parse(d.case_opening_dt) : Infinity;
    d.case_closing_dt = d.case_closing_dt ? dateTimeFormat.parse(d.case_closing_dt) : Infinity;
    d.created_on = d.created_on ? dateTimeFormat.parse(d.created_on) : Infinity;
    d.modified_on = d.modified_on ? dateTimeFormat.parse(d.modified_on) : Infinity;
    d.sg_arrival_date = d.sg_arrival_date ? dateTimeFormat.parse(d.sg_arrival_date) : Infinity;
    d.start_working_dt = d.start_working_dt ? dateFormat.parse(d.start_working_dt) : Infinity;
  });

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
  var case_opening_dt_dimGroup = case_opening_dt_dim.group(function (d) { return isFinite(d) ? d3.time.month(d) : "NaN"; });
  var case_closing_dt_dimGroup = case_closing_dt_dim.group(function (d) { return isFinite(d) ? d3.time.month(d) : "NaN"; });
  var created_on_dimGroup = created_on_dim.group(function (d) { return isFinite(d) ? d3.time.month(d) : "NaN"; });
  var modified_on_dimGroup = modified_on_dim.group(function (d) { return isFinite(d) ? d3.time.month(d) : "NaN"; });
  var sg_arrival_date_dimGroup = sg_arrival_date_dim.group(function (d) { return isFinite(d) ? d3.time.month(d) : "NaN"; });
  var start_working_dt_dimGroup = start_working_dt_dim.group(function (d) { return isFinite(d) ? d3.time.month(d) : "NaN"; });

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

  var worker_tp_dim = cf.dimension(function (d) { return d.worker_tp; });
  var gender_dim = cf.dimension(function (d) { return d.gender; });
  var edulvl_code_dim = cf.dimension(function (d) { return d.edulvl_code; });
  var marists_code_dim = cf.dimension(function (d) { return d.marists_code; });
  var natl_code_dim = cf.dimension(function (d) { return d.natl_code; });
  var casests_code_dim = cf.dimension(function (d) { return d.casests_code; });
  var worker_tp_dimGroup = worker_tp_dim.group();
  var gender_dimGroup = gender_dim.group();
  var edulvl_code_dimGroup = edulvl_code_dim.group();
  var marists_code_dimGroup = marists_code_dim.group();
  var natl_code_dimGroup = natl_code_dim.group();
  var casests_code_dimGroup = casests_code_dim.group();

  var total_sal_pm_domestic_dim = cf.dimension(function(e){
  	var d = e.total_sal_pm_domestic;
  	if (!isFinite(d)) return d;
  	//if (d < 0) return "< 0";
  	if (d == 0) return "0";
  	if (d < 100) return "" + (100-99) + " - " + (100);
  	if (d < 200) return "" + (200-99) + " - " + (200);
  	if (d < 300) return "" + (300-99) + " - " + (300);
  	if (d < 400) return "" + (400-99) + " - " + (400);
  	if (d < 500) return "" + (500-99) + " - " + (500);
  	else return "> 500";
  });
  var total_sal_pm_domestic_dimGroup = total_sal_pm_domestic_dim.group();
  var total_sal_pm_domestic_names = ["0", "" + (100-99) + " - " + (100), "" + (200-99) + " - " + (200), "" + (300-99) + " - " + (300), "" + (400-99) + " - " + (400), "" + (500-99) + " - " + (500), "> 500"];

  var abuse_dim = cf.dimension(function (d) {
  	if (d.physical_abuse_tick == "Y") return "physical_abuse";
  	if (d.emotional_abuse_tick == "Y") return "emotional_abuse";
  	if (d.sexual_abuse_tick == "Y") return "sexual_abuse";
  	if (d.illegal_deploy_tick == "Y") return "illegal_deploy";
  	if (d.overwork_tick == "Y") return "overwork";
  	if (d.dismissed_from_job_tick == "Y") return "dismissed_from_job";
  	if (d.insufficient_food_tick == "Y") return "insufficient_food";
  	if (d.poor_living_cond_tick == "Y") return "poor_living_cond";
  	if (d.medical_related_tick == "Y") return "medical_related";
  	if (d.safety_at_workplace_tick == "Y") return "safety_at_workplace";
  	if (d.salary_no_pay_tick == "Y") return "salary_no_pay";
  	if (d.withheld_wages_tick == "Y") return "withheld_wages";
  	if (d.deduction_from_wages_tick == "Y") return "deduction_from_wages";
  	if (d.issues_with_agent_tick == "Y") return "issues_with_agent";
  	if (d.other_tick == "Y") return "other";
  	return "none";
  });
  var abuse_dimGroup = abuse_dim.group();

  var age_dim = cf.dimension(function (d) { return isFinite(d.birth_dt) ? 2015 - parseInt(d.birth_dt) : null; });
  var age_dimGroup = age_dim.group(function (d) {
  		return isFinite(d) ? Math.round(d/5)*5 : null;
  	});

  var stay_duration_dim = cf.dimension(function(e){
  	var d = Math.round(e.sg_stay_duration / 30);

  	if (!isFinite(d) || isNaN(d)) return "NA";
  	if (d <= 12) return d.toString();
  	else return "12+";
  });
  var stay_duration_dimGroup = stay_duration_dim.group()
  var stay_duration_name = ["NA", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "12+"];

  var non_domestic_salary_dim = cf.dimension(function(e){
  	var d = Math.round(e.basic_salary_in_SGD_hour);

  	if (!isFinite(d) || isNaN(d)) return "NA";
  	if (d <= 10) return d.toString()
  	else return "10+";
  });
  var non_domestic_salary_dimGroup = non_domestic_salary_dim.group()
  var non_domestic_salary_name = ["NA", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "10+"];

  var day_off_per_mth_dim = cf.dimension(function(d) { return d.day_off_per_mth; });
  var day_off_per_mth_dimGroup = day_off_per_mth_dim.group();

  worker_tpChart.dimension(worker_tp_dim).group(worker_tp_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 10})
  	.width($(worker_tpChart.root()[0]).parent().width())
  	.height(200)
  	.elasticX(true)
  	.xAxis().ticks(4)
      ;
  genderChart.dimension(gender_dim).group(gender_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 10})
  	.width($(genderChart.root()[0]).parent().width())
  	.height(200)
  	.elasticX(true)
  	.xAxis().ticks(4)
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
  	.margins({top: 10, right: 30, bottom: 30, left: 10})
  	.width($(ageChart.root()[0]).parent().width())
  	.height(200)
      .x(d3.scale.linear().domain([15,60]))
      .elasticY(true)
  	.gap(-30)
  	.xAxis().ticks(4)
      ;

  total_sal_pm_domesticChart.dimension(total_sal_pm_domestic_dim).group(total_sal_pm_domestic_dimGroup)
  	.margins({top: 10, right: 30, bottom: 30, left: 10})
  	.width($(total_sal_pm_domesticChart.root()[0]).parent().width())
  	.height(200)
      .x(d3.scale.ordinal().domain(total_sal_pm_domestic_names))
      .xUnits(dc.units.ordinal)
      .elasticY(true)
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
  	.margins({top: 10, right: 10, bottom: 30, left: 10})
  	.width($(martsts_dpdntsChart.root()[0]).parent().width())
  	.height(200)
  	//.gap(70)
  	.x(d3.scale.linear().domain([0,5]))
      .elasticY(true)
  	.xAxis().ticks(4)
      ;
  sg_stay_total_daysChart.dimension(sg_stay_total_days_dim).group(sg_stay_total_days_dimGroup)
  	.margins({top: 10, right: 10, bottom: 30, left: 10})
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
  	.width($(case_closing_dtChart.root()[0]).parent().width())
  	.height(150)
      .x(d3.time.scale().domain([new Date(2011, 0, 1), new Date(2014, 0, 1)]))
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .elasticY(true)
      ;
  created_onChart.dimension(created_on_dim).group(created_on_dimGroup)
  	.width($(created_onChart.root()[0]).parent().width())
  	.height(150)
      .x(d3.time.scale().domain([new Date(2011, 0, 1), new Date(2014, 0, 1)]))
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .elasticY(true)
      ;
  modified_onChart.dimension(modified_on_dim).group(modified_on_dimGroup)
  	.width($(modified_onChart.root()[0]).parent().width())
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
  	.width($(start_working_dtChart.root()[0]).parent().width())
  	.height(150)
      .x(d3.time.scale().domain([new Date(2011, 0, 1), new Date(2014, 0, 1)]))
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .elasticY(true)
      ;

  industryChart.dimension(industry_dim).group(industry_dimGroup)
  	.margins({top: 10, right: 30, bottom: 30, left: 10})
  	.width($(industryChart.root()[0]).parent().width())
  	.height(200)
      .x(d3.scale.ordinal().domain(industry_dimGroup))
      .xUnits(dc.units.ordinal)
      .elasticY(true)
  	.xAxis().ticks(4)
      ;

  stay_durationChart.dimension(stay_duration_dim).group(stay_duration_dimGroup)
  	.margins({top: 10, right: 30, bottom: 30, left: 10})
  	.width($(industryChart.root()[0]).parent().width())
  	.height(200)
      .x(d3.scale.ordinal().domain(stay_duration_name))
      .xUnits(dc.units.ordinal)
      .elasticY(true)
  	.xAxis().ticks(4)
      ;

  non_domestic_salaryChart.dimension(non_domestic_salary_dim).group(non_domestic_salary_dimGroup)
  	.margins({top: 10, right: 30, bottom: 30, left: 10})
  	.width($(industryChart.root()[0]).parent().width())
  	.height(200)
      .x(d3.scale.ordinal().domain(non_domestic_salary_name))
      .xUnits(dc.units.ordinal)
      .elasticY(true)
  	.xAxis().ticks(4)
      ;

  day_off_per_mthChart.dimension(day_off_per_mth_dim).group(day_off_per_mth_dimGroup)
  	.margins({top: 10, right: 30, bottom: 30, left: 10})
  	.width($(industryChart.root()[0]).parent().width())
  	.height(200)
      .x(d3.scale.ordinal().domain(day_off_per_mth_dimGroup))
      .xUnits(dc.units.ordinal)
      .elasticY(true)
  	.xAxis().ticks(4)
      ;

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