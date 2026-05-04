// transform.js
const fs = require('fs');

const files = [
    'pim_prodfullview_details.html',
    'pim_prodfullview_details_reactivation_s1.html',
    'pim_prodfullview_details_update_s1.html',
    'pim_prodfullview_details_update_s2.html',
    'pim_prodfullview_details_update_s3.html',
    'pim_prodfullview_details_update_s4.html',
    'pim_prodfullview_details_update_s5.html'
];

function extractRows(html, idPrefix, tableId, typeName, typeClass, bgColor) {
    let tableRegex = new RegExp(`<table[^>]*id="${tableId}"[^>]*>[\\s\\S]*?<tbody>([\\s\\S]*?)<\\/tbody>`, 'i');
    let match = tableRegex.exec(html);
    if (!match) return '';
    
    let tbody = match[1];
    let rowRegex = new RegExp('<tr(.*?)>([\\s\\S]*?)<\\/tr>', 'gi');
    let newRows = [];
    
    let r;
    while ((r = rowRegex.exec(tbody)) !== null) {
        let trAttrs = r[1].replace(/style="display:\\s*none;?"/gi, '').trim();
        let inner = r[2];
        
        // Extract checkbox
        let isChecked = inner.includes('checked') || inner.includes('checked="checked"');
        
        // Extract layout module
        let tdRegex = new RegExp('<td[^>]*>([\\s\\S]*?)<\\/td>', 'gi');
        let tds = [];
        let tdMatch;
        while ((tdMatch = tdRegex.exec(inner)) !== null) {
            tds.push(tdMatch[1].trim());
        }
        
        if (tds.length < 3) continue; // skip if not matching
        
        let layoutModule = tds[1];
        let description = tds[2];
        
        // Add style="display: none;" if NOT checked (since default is Selected view)
        let displayStyle = isChecked ? '' : ' style="display: none;"';
        
        // Build new tr
        let newTr = `                                        <tr class="${typeClass}"${displayStyle} ${trAttrs}>
                                            <td style="text-align: center; width: 1px;background-color: ${bgColor};vertical-align: middle;font-weight: bold;">
                                                ${typeName}</td>
                                            <td style="text-align: center; width: 1px;vertical-align: middle;font-weight: bold;color: darkgreen;">
                                                ${layoutModule}</td>
                                            <td style="vertical-align: middle;">
                                                ${description}</td>
                                            <td style="text-align: center;vertical-align: middle;">
                                                <div class="switch switch-sm switch-success">
                                                    <input type="checkbox" name="switch" data-plugin-ios-switch ${isChecked ? 'checked="checked" ' : ''}/>
                                                </div>
                                            </td>
                                        </tr>`;
        newRows.push(newTr);
    }
    
    return newRows.join('\n');
}

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // --- SECTION 2 ---
    let sec2Start = content.indexOf('<!-- Start - Subpanel - Non-JDA driven for Belgium-->');
    let sec2End = content.indexOf('<!-- End - Subpanel - Non-JDA driven for Belgium-->');
    
    if (sec2Start !== -1 && sec2End !== -1) {
        let sec2Html = content.substring(sec2Start, sec2End);
        
        let allRows = [];
        allRows.push(extractRows(sec2Html, 'be_cs', 'table-sm-manual', 'SM manual', 'sm-manual', 'lightyellow'));
        allRows.push(extractRows(sec2Html, 'be_cl', 'table-sm-local', 'SM local', 'sm-local', 'linen'));
        allRows.push(extractRows(sec2Html, 'be_cb', 'table-sm-spcat', 'SM specific categories', 'sm-spcat', 'lightblue'));
        allRows.push(extractRows(sec2Html, 'be_cf', 'table-sm-aff', 'Affiliates', 'sm-affiliates', 'mistyrose'));
        allRows.push(extractRows(sec2Html, 'be_ce', 'table-sm-ecom', 'E-commerce', 'sm-ecom', 'lavender'));
        allRows.push(extractRows(sec2Html, 'be_cx', 'table-sm-exp', 'Export', 'sm-exp', 'honeydew'));
        allRows.push(extractRows(sec2Html, 'be_cy', 'table-sm-stm', 'Store Management', 'sm-stm', 'peachpuff'));
        
        let newSec2 = `
                        <!-- Assortments toolbar -->
                        <div class="row">
                            <div class="col-lg-9 offset-lg-1">
                                <div class="form-group row" style="padding:20px;background:mintcream;">
                                    <label class="col-sm-1 control-label text-sm-right pt-2">Display: </label>
                                    <div class="col-sm-3" style="text-align: center;">
                                        <div class="btn-group d-flex" role="group">
                                            <a class="btn btn-default w-100" role="button" id="btnAll">All</a>
                                            <a class="btn btn-primary w-100 active" role="button" id="btnSelected">Selected</a>
                                        </div>
                                    </div>
                                    <label class="col-sm-1 control-label text-sm-right pt-2">for: </label>
                                    <div class="col-sm-4">
                                        <select id="belgiumAssortmentFilter"
                                            class="form-control mb-3 cust-select assFilter">
                                            <option value="all" selected>All</option>
                                            <option value="sm-manual">SM manual</option>
                                            <option value="sm-local">SM local</option>
                                            <option value="sm-spcat">SM specific categories</option>
                                            <option value="sm-affiliates">Affiliates</option>
                                            <option value="sm-ecom">E-commerce</option>
                                            <option value="sm-exp">Export</option>
                                            <option value="sm-stm">Store Management</option>
                                        </select>
                                    </div>

                                    <div class="col-lg-3 text-right">
                                        <button class="btn btn-link" type="button" onclick="addRow();">
                                            <span class="fas fa-file-excel"></span> Download
                                            to Excel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Assortments table -->
                        <div class="row">
                            <div class="col-lg-9 offset-lg-1">
                                <table class="table table-responsive-md table-sm mb-0 table-hover">
                                    <thead>
                                        <tr>
                                            <th style="text-align: center;width: 25%;">Type</th>
                                            <th style="text-align: center;width: 20%;">Layout module</th>
                                            <th style="width: 45%;">Description</th>
                                            <th style="text-align: center;width: 10%;"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tableBodyBe">
${allRows.filter(Boolean).join('\n')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
`;
        let matchOld = sec2Html.match(/<div class="card-body">([\s\S]*?)<\/section>/);
        if (matchOld) {
            let oldContent = matchOld[1].replace(/<!--/g, '<! --').replace(/-->/g, '-- >');
            let replacementStr = `<div class="card-body">
${newSec2}
                                                <!-- OLD CONTENT COMMENTED OUT 
${oldContent}
                                                -->
                                        </section>`;
            let replacement = sec2Html.replace(/<div class="card-body">[\s\S]*?<\/section>/, () => replacementStr);
            content = content.substring(0, sec2Start) + replacement + content.substring(sec2End);
            console.log(file + ": replaced section 2");
        } else {
            console.log(file + ": matchOld failed for section 2");
        }
    }
    
    // --- SECTION 3 ---
    let sec3Start = content.indexOf('<!-- Start - Subpanel - Non-JDA driven for Luxembourg-->');
    let sec3End = content.indexOf('<!-- End - Subpanel - Non-JDA driven for Luxembourg-->');
    
    if (sec3Start !== -1 && sec3End !== -1) {
        let sec3Html = content.substring(sec3Start, sec3End);
        
        let allRows3 = [];
        allRows3.push(extractRows(sec3Html, 'lu_c2', 'table-sm-manual-lu', 'SM manual', 'sm-manual', 'lightyellow'));
        allRows3.push(extractRows(sec3Html, 'lu_c3', 'table-sm-aff-lu', 'Affiliates', 'sm-affiliates', 'honeydew'));
        
        let newSec3 = `
                        <!-- Assortments toolbar -->
                        <div class="row">
                            <div class="col-lg-9 offset-lg-1">
                                <div class="form-group row" style="padding:20px;background:mintcream;">
                                    <label class="col-sm-1 control-label text-sm-right pt-2">Display: </label>
                                    <div class="col-sm-3" style="text-align: center;">
                                        <div class="btn-group d-flex" role="group">
                                            <a class="btn btn-default w-100" role="button" id="btnAllLu">All</a>
                                            <a class="btn btn-primary w-100 active" role="button" id="btnSelectedLu">Selected</a>
                                        </div>
                                    </div>
                                    <label class="col-sm-1 control-label text-sm-right pt-2">for: </label>
                                    <div class="col-sm-4">
                                        <select id="luxembourgAssortmentFilter"
                                            class="form-control mb-3 cust-select assFilter">
                                            <option value="all" selected>All</option>
                                            <option value="sm-manual">SM manual</option>
                                            <option value="sm-affiliates">Affiliates</option>
                                        </select>
                                    </div>

                                    <div class="col-lg-3 text-right">
                                        <button class="btn btn-link" type="button" onclick="addRow();">
                                            <span class="fas fa-file-excel"></span> Download
                                            to Excel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Assortments table -->
                        <div class="row">
                            <div class="col-lg-9 offset-lg-1">
                                <table class="table table-responsive-md table-sm mb-0 table-hover">
                                    <thead>
                                        <tr>
                                            <th style="text-align: center;width: 25%;">Type</th>
                                            <th style="text-align: center;width: 20%;">Layout module</th>
                                            <th style="width: 45%;">Description</th>
                                            <th style="text-align: center;width: 10%;"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tableBodyLu">
${allRows3.filter(Boolean).join('\n')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
`;
        let matchOld3 = sec3Html.match(/<div class="card-body">([\s\S]*?)<\/section>/);
        if (matchOld3) {
            let oldContent3 = matchOld3[1].replace(/<!--/g, '<! --').replace(/-->/g, '-- >');
            let replacementStr3 = `<div class="card-body">
${newSec3}
                                                <!-- OLD CONTENT COMMENTED OUT 
${oldContent3}
                                                -->
                                        </section>`;
            let replacement3 = sec3Html.replace(/<div class="card-body">[\s\S]*?<\/section>/, () => replacementStr3);
            content = content.substring(0, sec3Start) + replacement3 + content.substring(sec3End);
            console.log(file + ": replaced section 3");
        } else {
            console.log(file + ": matchOld failed for section 3");
        }
    }
    
    fs.writeFileSync(file, content, 'utf8');
});
console.log('Done transformation!');
