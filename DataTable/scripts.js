$(function(){
    let dataTable = {
        dataSource: employees,
        totalRecords: employees.length,
        tableSelect: $("tbody"),
        pagination: $(".pagination"),
        totalPages: 0,
        currentPage: 1,
        perPages: 5,
        isASCSorted: false,
        attrSort: "",

        init: function(){
            this.initData();
            this.initEvent();
            this.search();
            this.sortElement();
        },

        initData: function(){
            this.renderRecords(this.currentPage);
            this.renderPagination();
        },

        renderRecords: function(pageNum){
            let begin = (pageNum-1)*this.perPages,
                end = (pageNum)*this.perPages > this.totalRecords ? this.totalRecords : (pageNum)*this.perPages;
            $("#begin").text((this.totalRecords > 0 ? (begin+1) : 0).toString());
            $("#end").text(end.toString());
            $("#total").text(this.totalRecords.toString());
            
            this.tableSelect.empty();
            for(let i = begin; i < end; i++){
                this.tableSelect.append("<tr>\
                                            <td>" + this.dataSource[i].name + "</td>\
                                            <td>" + this.dataSource[i].position + "</td>\
                                            <td>" + this.dataSource[i].office + "</td>\
                                            <td>" + this.dataSource[i].age + "</td>\
                                            <td>" + this.dataSource[i].startDate + "</td>\
                                            <td>" + this.dataSource[i].salary + "$</td>\
                                        </tr>")
            }
        },

        renderPagination: function () {
            let html = "";
            this.pagination.empty();
            this.totalPages = Math.ceil(this.totalRecords / this.perPages);
            html += `<a data-id="1" title="First page">First</a>
                    <a data-id="prev" title="Previous page">Prev</a>`;
            for (let i = 1; i <= this.totalPages; i++) {
              html += `<a data-id="${i}" class="page-index">${i}</a>`;
            }
            html += `<a data-id="next" title="Next page">Next</a>
                         <a data-id=${this.totalPages} title="Last page">Last</a>`;
            this.pagination.append(html);
          },

        initEvent: function(){
            this.bindEventChangeRecordPerPage();
            this.bindEventChangingPage();
        },

        bindEventChangeRecordPerPage: function(){
            let self = this;
            $("#entries").on("change", function(){
                self.perPages = $(this).val();
                self.currentPage = 1;
                self.renderPagination();
                self.renderRecords(self.currentPage);
                self.bindEventChangingPage();
            });
        },

        bindEventChangingPage: function(){
            let self = this;
            self.checkValidation();
            this.pagination.children().on("click", function () {
                let value = $(this).data("id");
                if (value === "prev") {
                  value = self.currentPage <= 1 ? 1 : self.currentPage - 1;
                } else if (value === "next") {
                  value = self.currentPage >= self.totalPages ? self.totalPages : self.currentPage + 1;
                }
                self.currentPage = value;
                self.checkValidation();
                self.renderRecords(self.currentPage);
            });
        },

        checkValidation: function(){
            let self = this,
                firstPage = $("[title='First page']"),
                prevPage = $("[title='Previous page']"),
                nextPage = $("[title='Next page']"),
                lastPage = $("[title='Last page']");
            
            $(".page-index").removeClass("active").eq(self.currentPage - 1).addClass("active");
            firstPage.show();
            prevPage.show();
            nextPage.show();
            lastPage.show();

            if (this.currentPage <= 1) {
                prevPage.hide();
                firstPage.hide();
            } 
            if (this.currentPage >= this.totalPages) {
                nextPage.hide();
                lastPage.hide();
            }
        },

        search: function(){
            let self = this;
            $("#txtSearch").on("keyup", function(){
                let employeesSearch = [],
                txtSearch = $("#txtSearch").val();
                txtSearch = txtSearch.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\\]/g,"").trim().toString();
                txtSearch = txtSearch.replace(/\s+/g, " ").trim().toString();
                for (let employee of employees){
                    if(employee.name.toLowerCase().search(txtSearch.toLowerCase()) != -1)
                        employeesSearch.push(employee);
                }
                self.dataSource = employeesSearch;
                self.totalRecords = employeesSearch.length;
                self.currentPage = 1;
                self.initData();
                self.bindEventChangingPage();
            });
        },

        sortElement: function(){
            let self = this;
            $("#sort").children().on("click", function() {
                let attr = $(this).data("sort");
                $("#sort > td > * ").removeClass("active");

                if(attr !== self.attrSort) {
                    self.attrSort = attr;
                    self.isASCSorted = false;
                }

                if(self.isASCSorted) {
                    self.isASCSorted = false;
                    $(this).children(".desc").addClass("active");
                    self.dataSource = self.dataSource.reverse();
                }
                else {
                    self.isASCSorted = true;
                    $(this).children(".asc").addClass("active");

                    if(attr === "age" || attr === "salary") {
                        self.dataSource = self.dataSource.sort(function(a, b) {
                            return a[attr] - b[attr];
                        });
                    }
                    else {
                        self.dataSource = self.dataSource.sort(function(a, b) {
                            return a[attr].localeCompare(b[attr]);
                        });
                    }
                }
                self.currentPage = 1;
                self.initData();
                self.initEvent();
            });
        }
    };
    dataTable.init();
});