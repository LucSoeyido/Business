import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Dashboard() {
  useEffect(() => {
    if (typeof window.ApexCharts === 'undefined') return;

    const commonBarOptions = {
      chart: { type: 'bar', height: 300, toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
      dataLabels: { enabled: false },
      colors: ['#4f46e5'],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
    };

    // ---- Sales Pipeline Bar Charts ----
    const barCharts = [
      { id: '#leads-bar-chart',    data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 80, 60, 45] },
      { id: '#proposal-bar-chart', data: [20, 35, 40, 45, 55, 65, 60, 75, 100, 70, 50, 35] },
      { id: '#contract-bar-chart', data: [15, 25, 30, 35, 45, 55, 50, 65,  90, 60, 40, 25] },
      { id: '#project-bar-chart',  data: [25, 38, 42, 48, 52, 68, 72, 88, 115, 75, 55, 40] },
    ];
    const barInstances = barCharts.map(({ id, data }) => {
      const el = document.querySelector(id);
      if (!el) return null;
      const chart = new window.ApexCharts(el, {
        ...commonBarOptions,
        series: [{ name: 'Deals', data }],
      });
      chart.render();
      return chart;
    });

    // ---- Revenue Overview – Line Chart ----
    let revenueChart = null;
    const revenueEl = document.querySelector('#revenue-line-chart');
    if (revenueEl) {
      revenueChart = new window.ApexCharts(revenueEl, {
        chart: { type: 'line', height: 300, toolbar: { show: false }, zoom: { enabled: false } },
        series: [
          { name: 'Revenue',  data: [31, 40, 28, 51, 42, 109, 100, 80, 95,  70, 88, 120] },
          { name: 'Expenses', data: [11, 32, 45, 32, 34,  52,  41, 60, 44,  55, 40,  70] },
        ],
        stroke: { curve: 'smooth', width: 2 },
        colors: ['#4f46e5', '#f97316'],
        xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
        legend: { position: 'top' },
        dataLabels: { enabled: false },
      });
      revenueChart.render();
    }

    // ---- Deals by Status – Donut Chart ----
    let dealsChart = null;
    const dealsEl = document.querySelector('#deals-donut-chart');
    if (dealsEl) {
      dealsChart = new window.ApexCharts(dealsEl, {
        chart: { type: 'donut', height: 280 },
        series: [44, 55, 13, 43],
        labels: ['Won', 'Lost', 'Pending', 'In Progress'],
        colors: ['#22c55e', '#ef4444', '#f97316', '#4f46e5'],
        legend: { position: 'bottom' },
        plotOptions: { pie: { donut: { size: '65%' } } },
        dataLabels: { enabled: true },
      });
      dealsChart.render();
    }

    // ---- Customers Growth – Area Chart ----
    let customersChart = null;
    const customersEl = document.querySelector('#customers-area-chart');
    if (customersEl) {
      customersChart = new window.ApexCharts(customersEl, {
        chart: { type: 'area', height: 260, toolbar: { show: false } },
        series: [{ name: 'New Customers', data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 100, 75, 120] }],
        xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
        colors: ['#4f46e5'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
        stroke: { curve: 'smooth', width: 2 },
        dataLabels: { enabled: false },
      });
      customersChart.render();
    }

    return () => {
      barInstances.forEach(c => c && c.destroy());
      revenueChart   && revenueChart.destroy();
      dealsChart     && dealsChart.destroy();
      customersChart && customersChart.destroy();
    };
  }, []);

  return (
    <>
      {/* ===== NAVIGATION ===== */}
       <Navbar/>

      {/* ===== HEADER ===== */}
      
     

      {/* ===== MAIN ===== */}
      <main className="nxl-container">
        <div className="nxl-content">

          {/* Page header */}
          <div className="page-header">
            <div className="page-header-left d-flex align-items-center">
              <div className="page-header-title">
                <h5 className="m-b-10">Reports</h5>
              </div>
              <ul className="breadcrumb">
                <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                <li className="breadcrumb-item">Sales</li>
              </ul>
            </div>
            <div className="page-header-right ms-auto">
              <div className="page-header-right-items">
                <div className="d-flex d-md-none">
                  <a href="javascript:void(0)" className="page-header-right-close-toggle">
                    <i className="feather-arrow-left me-2"></i><span>Back</span>
                  </a>
                </div>
                <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
                  <div className="dropdown filter-dropdown">
                    <a className="btn btn-light-brand" data-bs-toggle="dropdown" data-bs-offset="0, 10" data-bs-auto-close="outside">
                      <i className="feather-filter me-2"></i><span>Filter</span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                      {['Role','Team','Email','Member','Recommendation'].map(item => (
                        <div className="dropdown-item" key={item}>
                          <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id={item} defaultChecked />
                            <label className="custom-control-label c-pointer" htmlFor={item}>{item}</label>
                          </div>
                        </div>
                      ))}
                      <div className="dropdown-divider"></div>
                      <a href="javascript:void(0);" className="dropdown-item"><i className="feather-plus me-3"></i><span>Create New</span></a>
                      <a href="javascript:void(0);" className="dropdown-item"><i className="feather-filter me-3"></i><span>Manage Filter</span></a>
                    </div>
                  </div>
                  <a href="javascript:void(0);" className="btn btn-primary">
                    <i className="feather-plus me-2"></i><span>Add Widgets</span>
                  </a>
                </div>
              </div>
              <div className="d-md-none d-flex align-items-center">
                <a href="javascript:void(0)" className="page-header-right-open-toggle">
                  <i className="feather-align-right fs-20"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="main-content">
            <div className="row">

              {/* ── KPI Cards ── */}
              {[
                { icon:'feather-dollar-sign',  label:'Active Deals',   value:'5,658',  prev:'4,563',  badge:'+ 23.65%', color:'success' },
                { icon:'feather-pie-chart',    label:'Revenue Deals',  value:'89,657', prev:'76,852', badge:'- 06.32%', color:'danger'  },
                { icon:'feather-plus-square',  label:'Deals Created',  value:'2,354',  prev:'1,578',  badge:'+ 30.47%', color:'success' },
                { icon:'feather-sunset',       label:'Deals Closing',  value:'2,422',  prev:'2,847',  badge:'- 08.55%', color:'danger'  },
              ].map(({ icon, label, value, prev, badge, color }) => (
                <div className="col-xxl-3 col-md-6" key={label}>
                  <div className="card stretch stretch-full">
                    <div className="card-body">
                      <div className="hstack justify-content-between">
                        <div>
                          <div className="hstack gap-2 mb-4">
                            <i className={icon}></i><span>{label}</span>
                          </div>
                          <h4 className="fw-bolder mb-3">$<span className="counter">{value}</span> USD</h4>
                          <p className="fs-12 text-muted mb-0">vs last month: <span className="fw-semibold text-dark">${prev} USD</span></p>
                        </div>
                        <a href="javascript:void(0);" className={`badge bg-soft-${color} text-${color}`}>{badge}</a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* ── Sales Pipeline (Bar Charts) ── */}
              <div className="col-xxl-8">
                <div className="card stretch stretch-full">
                  <div className="card-header">
                    <h5 className="card-title">Sales Pipeline</h5>
                    <div className="card-header-action">
                      <div className="card-header-btn">
                        <div data-bs-toggle="tooltip" title="Delete">
                          <a href="javascript:void(0);" className="avatar-text avatar-xs bg-danger" data-bs-toggle="remove"> </a>
                        </div>
                        <div data-bs-toggle="tooltip" title="Refresh">
                          <a href="javascript:void(0);" className="avatar-text avatar-xs bg-warning" data-bs-toggle="refresh"> </a>
                        </div>
                        <div data-bs-toggle="tooltip" title="Maximize/Minimize">
                          <a href="javascript:void(0);" className="avatar-text avatar-xs bg-success" data-bs-toggle="expand"> </a>
                        </div>
                      </div>
                      <div className="dropdown">
                        <a href="javascript:void(0);" className="avatar-text avatar-sm" data-bs-toggle="dropdown" data-bs-offset="25, 25">
                          <i className="feather-more-vertical"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a href="javascript:void(0);" className="dropdown-item"><i className="feather-at-sign"></i>New</a>
                          <a href="javascript:void(0);" className="dropdown-item"><i className="feather-calendar"></i>Event</a>
                          <a href="javascript:void(0);" className="dropdown-item"><i className="feather-trash-2"></i>Deleted</a>
                          <div className="dropdown-divider"></div>
                          <a href="javascript:void(0);" className="dropdown-item"><i className="feather-settings"></i>Settings</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body custom-card-action">
                    <ul className="nav mb-4 gap-4 sales-pipeline-tabs" role="tablist">
                      {[
                        { target:'leadsTab',    label:'Leads',    amount:'$47,569', deals:'57 Deals', active:true  },
                        { target:'proposalTab', label:'Proposal', amount:'$35,258', deals:'46 Deals', active:false },
                        { target:'contractTab', label:'Contract', amount:'$24,569', deals:'34 Deals', active:false },
                        { target:'projectTab',  label:'Project',  amount:'$53,853', deals:'42 Deals', active:false },
                      ].map(({ target, label, amount, deals, active }) => (
                        <li className="nav-item" role="presentation" key={target}>
                          <a href="javascript:void(0);" className={`nav-link text-start${active?' active':''}`} data-bs-toggle="tab" data-bs-target={`#${target}`} role="tab">
                            <span className="fw-semibold text-dark d-block">{label}</span>
                            <span className="amount fs-18 fw-bold my-1 d-block">{amount}</span>
                            <span className="deals fs-12 text-muted d-block">{deals}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <div className="tab-content">
                      <div className="tab-pane fade show active" id="leadsTab"    role="tabpanel"><div id="leads-bar-chart"></div></div>
                      <div className="tab-pane fade"            id="proposalTab" role="tabpanel"><div id="proposal-bar-chart"></div></div>
                      <div className="tab-pane fade"            id="contractTab" role="tabpanel"><div id="contract-bar-chart"></div></div>
                      <div className="tab-pane fade"            id="projectTab"  role="tabpanel"><div id="project-bar-chart"></div></div>
                    </div>
                  </div>
                  <div className="card-footer d-md-flex flex-wrap p-4 pt-5 border-top border-gray-5">
                    {[
                      { label:'Current',    amount:'$65,658 USD', color:'primary' },
                      { label:'Overdue',    amount:'$34,541 USD', color:'danger'  },
                      { label:'Additional', amount:'$20,478 USD', color:'success' },
                    ].map(({ label, amount, color }, i) => (
                      <React.Fragment key={label}>
                        {i > 0 && <div className="vr mx-4 text-gray-600 d-none d-md-flex"></div>}
                        <div className="flex-fill mb-4 mb-md-0 pb-2 pb-md-0">
                          <p className={`fs-11 fw-semibold text-uppercase text-${color} mb-2`}>{label}</p>
                          <h2 className="fs-20 fw-bold mb-0">{amount}</h2>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── NEW: Deals by Status – Donut Chart ── */}
              <div className="col-xxl-4">
                <div className="card stretch stretch-full">
                  <div className="card-header">
                    <h5 className="card-title">Deals by Status</h5>
                  </div>
                  <div className="card-body">
                    <div id="deals-donut-chart"></div>
                    <div className="row g-2 mt-3">
                      {[
                        { label:'Won',         color:'success' },
                        { label:'Lost',        color:'danger'  },
                        { label:'Pending',     color:'warning' },
                        { label:'In Progress', color:'primary' },
                      ].map(({ label, color }) => (
                        <div className="col-6" key={label}>
                          <div className={`d-flex align-items-center gap-2 p-2 rounded bg-soft-${color}`}>
                            <i className={`feather-circle text-${color} fs-10`}></i>
                            <span className="fs-12 fw-semibold">{label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── NEW: Revenue Overview – Line Chart ── */}
              <div className="col-xxl-8">
                <div className="card stretch stretch-full">
                  <div className="card-header">
                    <h5 className="card-title">Revenue Overview</h5>
                    <div className="card-header-action">
                      <div className="dropdown">
                        <a href="javascript:void(0);" className="btn btn-sm btn-light-brand" data-bs-toggle="dropdown">This Year</a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a href="javascript:void(0);" className="dropdown-item">This Year</a>
                          <a href="javascript:void(0);" className="dropdown-item">Last Year</a>
                          <a href="javascript:void(0);" className="dropdown-item">Last 6 Months</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div id="revenue-line-chart"></div>
                  </div>
                </div>
              </div>

              {/* ── NEW: Customers Growth – Area Chart ── */}
              <div className="col-xxl-4">
                <div className="card stretch stretch-full">
                  <div className="card-header">
                    <h5 className="card-title">Customers Growth</h5>
                  </div>
                  <div className="card-body">
                    <div id="customers-area-chart"></div>
                    <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
                      <div>
                        <p className="fs-12 text-muted mb-1">Total New Customers</p>
                        <h4 className="fw-bolder mb-0">+1,248</h4>
                      </div>
                      <a href="javascript:void(0);" className="badge bg-soft-success text-success">+ 18.4%</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Active Deals Progress ── */}
              <div className="col-lg-12">
                <div className="card stretch stretch-full">
                  <div className="card-header">
                    <h5 className="card-title">Active Deals Progress</h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-4">
                      {[
                        { num:1, date:'22 March, 2023', name:'Alexandra Della',  avatar:'1' },
                        { num:2, date:'23 March, 2023', name:'Green Cute',       avatar:'2' },
                        { num:3, date:'24 March, 2023', name:'Holmes Cherryman', avatar:'3' },
                        { num:4, date:'25 March, 2023', name:'Malanie Hanvey',   avatar:'4' },
                      ].map(({ num, date, name, avatar }) => (
                        <div className="col-xxl-3 col-lg-6" key={num}>
                          <div className="border border-dashed border-gray-5 p-4 rounded-3 gap-4 text-center">
                            <div className={`sales-progress-${num}`}></div>
                            <div className="mt-4">
                              <p className="fs-12 text-muted mb-1">Closing date: <span className="fs-11 fw-medium text-dark">{date}</span></p>
                              <a href="javascript:void(0);" className="fw-bold text-truncate-1-line">Web development deal with alex</a>
                              <div className="hstack gap-3 mt-3 justify-content-center">
                                <div className="avatar-image avatar-sm">
                                  <img src={`src/assets/images/avatar/${avatar}.png`} alt="" className="img-fluid" />
                                </div>
                                <a href="javascript:void(0);">{name}</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
       <Footer/>
      </main>

      {/* ===== SEARCH MODAL ===== */}
      <div className="modal fade-scale" id="searchModal" aria-hidden="true" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-top modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header search-form py-0">
              <div className="input-group">
                <span className="input-group-text"><i className="feather-search fs-4 text-muted"></i></span>
                <input type="text" className="form-control search-input-field" placeholder="Search..." />
                <span className="input-group-text">
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </span>
              </div>
            </div>
            <div className="modal-body">
              <div className="searching-for mb-5">
                <h4 className="fs-13 fw-normal text-gray-600 mb-3">I&apos;m searching for...</h4>
                <div className="row g-1">
                  {['Recent','Command','Peoples','Files','Medias','More'].map(item => (
                    <div className="col-md-4 col-xl-2" key={item}>
                      <a href="javascript:void(0);" className="d-flex align-items-center gap-2 px-3 lh-lg border rounded-pill">
                        <span>{item}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== LANGUAGE MODAL ===== */}
      <div className="modal fade-scale" id="languageSelectModal" aria-hidden="true" aria-labelledby="languageSelectModalLabel" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="languageSelectModalLabel">Select Language</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                {[['sa','Arabic'],['bd','Bengali'],['ch','Chinese'],['hr','Croatian'],['dk','Danish'],['nl','Dutch'],
                  ['us','English'],['fi','Filipino'],['fr','French'],['de','German'],['il','Hebrew'],['in','Hindi'],
                  ['id','Indonesian'],['it','Italian'],['jp','Japanese'],['kr','Korean'],['ir','Persian'],['pt','Portuguese'],
                  ['ru','Russian'],['es','Spanish'],['sv','Swedish'],['tr','Turkish'],['pk','Urdu'],['vi','Vietnamese'],
                ].map(([flag, label]) => (
                  <div key={flag} className={`col-6 col-md-4 col-lg-3 language_select${flag==='us'?' active':''}`}>
                    <a href="javascript:void(0);" className="d-flex align-items-center gap-2">
                      <div className="avatar-image avatar-sm">
                        <img src={`src/assets/vendors/img/flags/1x1/${flag}.svg`} alt={label} className="img-fluid" />
                      </div>
                      <span>{label}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TOAST ===== */}
      <div className="position-fixed" style={{ right: '5px', bottom: '5px', zIndex: 999999 }}>
        <div id="toast" className="toast bg-black hide" data-bs-delay="3000" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header px-3 bg-transparent d-flex align-items-center justify-content-between border-bottom border-light border-opacity-10">
            <div className="text-white mb-0">Downloading...</div>
            <a href="javascript:void(0)" className="ms-2 mb-1 close fw-normal" data-bs-dismiss="toast" aria-label="Close">
              <span className="text-white">&times;</span>
            </a>
          </div>
          <div className="toast-body p-3 text-white">
            <h6 className="fs-13 text-white">Project.zip</h6>
            <span className="text-light fs-11">4.2mb of 5.5mb</span>
          </div>
          <div className="toast-footer p-3 pt-0 border-top border-light border-opacity-10">
            <div className="progress mt-3" style={{ height: '5px' }}>
              <div className="progress-bar progress-bar-striped progress-bar-animated w-75 bg-dark"
                role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}></div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== THEME CUSTOMIZER ===== */}
      <div className="theme-customizer">
        <div className="customizer-handle">
          <a href="javascript:void(0);" className="cutomizer-open-trigger bg-primary">
            <i className="feather-settings"></i>
          </a>
        </div>
        <div className="customizer-sidebar-wrapper">
          <div className="customizer-sidebar-header px-4 ht-80 border-bottom d-flex align-items-center justify-content-between">
            <h5 className="mb-0">Theme Settings</h5>
            <a href="javascript:void(0);" className="cutomizer-close-trigger d-flex"><i className="feather-x"></i></a>
          </div>
          <div className="customizer-sidebar-body position-relative p-4" data-scrollbar-target="#psScrollbarInit">

            {[
              { id:'appNavigationList', name:'app-navigation', title:'Navigation' },
              { id:'appHeaderList',     name:'app-header',     title:'Header'     },
              { id:'appSkinList',       name:'app-skin',       title:'Skins'      },
            ].map(({ id, name, title }) => (
              <div className="position-relative px-3 pb-3 pt-4 mt-3 mb-5 border border-gray-2 theme-options-set" key={title}>
                <label className="py-1 px-2 fs-8 fw-bold text-uppercase text-muted text-spacing-2 bg-white border border-gray-2 position-absolute rounded-2 options-label" style={{ top: '-12px' }}>{title}</label>
                <div className={`row g-2 theme-options-items ${name.replace('app-','app-')}`} id={id}>
                  {['Light','Dark'].map((v, i) => {
                    const inputId = `${name}-${v.toLowerCase()}`;
                    return (
                      <div className="col-6 text-center single-option" key={v}>
                        <input type="radio" className="btn-check" id={inputId} name={name} value={String(i+1)} defaultChecked={i===0} />
                        <label className="py-2 fs-9 fw-bold text-dark text-uppercase text-spacing-1 border border-gray-2 w-100 h-100 c-pointer position-relative options-label" htmlFor={inputId}>{v}</label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          </div>
          <div className="customizer-sidebar-footer px-4 ht-60 border-top d-flex align-items-center gap-2">
            <div className="flex-fill w-50">
              <a href="javascript:void(0);" className="btn btn-danger" data-style="reset-all-common-style">Reset</a>
            </div>
            <div className="flex-fill w-50">
              <a href="https://www.themewagon.com/themes/Duralux-admin" target="_blank" rel="noreferrer" className="btn btn-primary">Download</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}