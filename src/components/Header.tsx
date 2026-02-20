
export default function Herader() {

    return (
        <div className="page-header" style={{backgroundColor:'black',color:'white'}}>
            <div className="page-header-left d-flex align-items-center">
              <div className="page-header-title">
                <h5 className="m-b-10" style={{color:'white'}}>Reports</h5>
              </div>
              <ul className="breadcrumb">
                <li className="breadcrumb-item"><a href="index.html" style={{color:'white'}}>Home</a></li>
                <li className="breadcrumb-item" style={{color:'white'}}>Sales</li>
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
    )
}