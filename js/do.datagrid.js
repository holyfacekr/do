(function($do){
	'use strict';
	
	var defaultOptions = {
		version: '0.9.01',
		copyright: 'Yong-Sung Park',
    	rootUrl: '/',
        columns: [],
        dataSource : [],
        rowAttr: [],
        showDataGridHeader: true,
        showDataCount: true,
        showNoDataMessage: true,
        dataGridTitle: null,
        webServiceUrl: null,
        order: true,
        language: 'kr',
        csrfToken: null,
        
        width: null,
        height: null,
        
        theadRowCount: 1,
        
        /* 페이지 관련 옵션 */
        pagination: true,
        pageCount: 10,
        rowsPerPage: 15,
        
        afterRetrieveList: false,
        afterRowClick: false,
        afterImgClick: false,
        afterButtonClick: false
    };
	
	var DoDataGridTest = {
		init: function(options, element) {
			this.elem = $do(element);
    		this.options = Object.assign({}, defaultOptions, options);
    		this.columns = this.options.columns;
            this.dataSource = this.options.dataSource;
            this.rowAttr = this.options.rowAttr;
            this.currentPageNo = 1;
            this.totalDataCount = 0;
            this.rowsPerPage = this.options.rowsPerPage;
            this.elem.addClass('do-datagrid');
            
            if(this.options.showDataGridHeader)	this.dataGridHead 	= $do('<div class="data-grid-head"></div>');
            
            this.dataGridBody = $do('<div class="data-grid-body"></div>');
            this.dataGridFooter = $do('<div class="data-grid-footer"></div>');
            this.dataGridLoading = $do('<div class="loading"></div>');

            this.elem.append(this.dataGridHead);
            this.elem.append(this.dataGridBody);
            this.elem.append(this.dataGridFooter);
            this.elem.append(this.dataGridLoading);
            
            this.dataGridTable 	= $do('<table class="data-grid-table"></table>');
            this.dataGridBody.append(this.dataGridTable);
            
            this.buildDataGridHead();

	 		this.customEvents();
            
            if(this.columns) this.buildDataGridBody('init');
		},
		buildDataGridHead: function() {
        	var base = this;
        	{
        		if(this.options.dataGridTitle)
        			this.dataGridHead.append('<span class="data-grid-sub-title">' + this.options.dataGridTitle + '</span>');
        		
        		if(this.options.showDataCount)
        		{
        			if(this.options.language == 'kr')
        				this.dataGridHead.append('<span class="data-total-count-container fc_darkblue">검색결과 ( <span class="count fc_red">0</span> 건)</span>');
        			else
        				this.dataGridHead.append('<span class="data-total-count-container">Total <span class="count fc_red">0</span> results</span>');
        		}
        	}
        },
        buildDataGridBody: function(type) {
            var base = this;

            if(type == 'init') base.buildTableHead();
            
            if(type != 'init' || base.dataSource) base.buildTableBody();
        },
        buildTableHead: function() {
        	var base = this;
        	
        	// base.dataGridTable.empty();
        	
        	base.dataGridTableHead = $do('<thead></thead>');
        	
        	for (var rowCnt = 0; rowCnt < base.options.theadRowCount; rowCnt++)
        	{
        		var colspanCnt = 0;
     			var preCaption = '';
     			var preDataField = '';
    			var curCaption = '';
    			
        		var tr = $do('<tr></tr>');
        		
        		for (var i = 0; i < base.columns.length; i++)
	            {
        			var isTH = true;
	    			var caption = base.columns[i].caption;
	    			var th = $do('<th></th>');
	    			
	    			if(base.columns[i].dataField)	th.attr('column-name', base.columns[i].dataField);
	    			if(base.columns[i].width)		th.width(base.columns[i].width);
	    			
	    			if(base.columns[i].dataType == 'checkbox')
    				{
	    				if(caption)
    					{
    						th.append('<span>' + caption + '</span>');
    					}
	    				else
                     	{
                     		var checkbox = $do('<input type="checkbox">');
                     		checkbox.css('cursor', 'pointer');
                     		
                     		checkbox.on('click', function(event) {
                     			var obj = event.target;
        
                     			if(base.options.multiCheckBox)
                     			{
                     				base.elem.find('input[type="checkbox"]').each(function(){
                                 		this.checked = obj.checked;
                                 	});	
                     			}
                     			else
                     			{
                     				base.dataGridTableBody.find('input[type="checkbox"]').each(function(){
                     					if(!$do(this).attr('name')) this.checked = obj.checked;
                                 	});
                     			}
                     			
                            	if(base.options.afterCheckBoxChange)
                        			base.afterCheckBoxChange($do(event.target), $do(event.target).parent().parent());
                             	
                            	event.stopPropagation();
                     		});             

                     		th.css({'cursor': 'pointer', 'width': '40px'});
                     		th.append(checkbox);
                     	}
                     	
    					if(base.options.theadRowCount > 1)
    					{
    						th.attr('rowSpan', base.options.theadRowCount);

    						if(rowCnt != 0) isTH = false;
    					}
    				}
	    			else
	    			{
	    				th.append('<span>' + caption + '</span>');
						
						if(base.options.theadRowCount > 1)
							th.attr('rowSpan', base.options.theadRowCount);
        				 
						if(rowCnt != 0) isTH = false;
	    			}
	    			
	    			if(isTH) tr.append(th);
	    			
	    			/*
	    			th.on('click', function (event) {
	    				if($do(event.target).find('input[type=checkbox]').length > 0)
	                 	{
	                 		var checkBox = $do(event.target).find('input[type=checkbox]');
	                 		
	                 		if (checkBox.is(':checked'))	checkBox.prop('checked', false);
	                 		else							checkBox.prop('checked', true);
	
	                 		if(base.options.multiCheckBox)
	                 		{
	                 			base.elem.find('input[type=\"checkbox\"]').each(function(){
	                         		this.checked = checkBox.is(':checked');
	                         	});	
	                 		}
	                 		else
	                     	{
	                 			base.doDataGridTableBody.find('input[type=\"checkbox\"]').each(function(){
	                 				if(!$do(this).attr('name')) this.checked = $checkBox.is(':checked');
	                         	});	
	                     	}
	                 		
	                 		if(base.options.afterCheckBoxChange)
	                			base.afterCheckBoxChange($do(event.target), $do(event.target).parent().parent());
	                         
	                 		return;
	                 	}
	    			});
	    			*/
	            }
        		
        		base.dataGridTableHead.append(tr);
        	}
        	
        	base.dataGridTable.append(base.dataGridTableHead);
        },
        buildTableBody: function() {
            var base = this;
            
            base.dataGridTable.find('tbody').remove();
            
            base.dataGridTableBody = $do('<tbody></tbody>');
            
            if(!base.dataSource || base.dataSource.length == 0)
            {
            	if(base.options.showNoDataMessage)
            	{
            		if(base.options.language == 'kr')
            			base.dataGridTableBody.append('<tr class="no-data"><td class="no-data" colspan="' + base.columns.length + '">검색결과가 없습니다.</td></tr>');
            		else
            			base.dataGridTableBody.append('<tr class="no-data"><td class="no-data" colspan="' + base.columns.length + '">No Data.</td></tr>');
            	}
            }
            else
            {
            	var length = base.dataSource.length;
            	
                for (var i = 0; i < length; i++)
                	base.addRow(base.dataSource[i]);
            }
            
            base.dataGridTable.append(base.dataGridTableBody);
            
            base.buildPagination();
        },
        addRow: function(data, type) {
        	var base = this;
        	
        	// base.dataGridTableBody.find('.no-data').parent().remove();
        	
            var tr = $do('<tr></tr>');
            
            if(type) tr.addClass('new-data');
            
            var columnsLength = base.columns.length;
            
            for (var i = 0; i < columnsLength; i++)
            {
            	var dataField = base.columns[i].dataField;
            	var dataType = base.columns[i].dataType;
            	
            	if(base.rowAttr && data)
            	{
            		var length = base.rowAttr.length;
            		
            		// tr의 attribute 추가 (onclick 처리를 위한 속성값)
            		for(var rowAttrIdx = 0; rowAttrIdx < length; rowAttrIdx++)
            		{
            			if(data[base.rowAttr[rowAttrIdx].dataField] !== undefined)
            				tr.attr(base.rowAttr[rowAttrIdx].name, data[base.rowAttr[rowAttrIdx].dataField]);
            		}
            	}
            	
                var td = $do('<td></td>');
                
                if(dataField)									td.attr('column-name', dataField);
                else if(!dataField && dataType == 'checkbox')	td.attr('column-name', 'checkbox');
                	
                if(base.columns[i].alignment)	td.css('text-align', base.columns[i].alignment);
                
                if(dataType && (!base.columns[i].readonly || type))
                {
                	if(dataType == 'checkbox')
                    {
                        var checkbox = $do('<input type="checkbox">');
                        checkbox.css('cursor', 'pointer');
                        
                    	if(dataField && (data[dataField] == 'checked' || data[dataField] == 'Y' || data[dataField] == 'y'))
                    		checkBox.prop('checked', true);

                    	td.addClass('column-checkbox');
                        td.css({'text-align':'center', 'cursor':'pointer'});
                        td.append(checkbox);
                        
                        if(dataField)
                        {
                        	checkbox.attr('name', dataField);
                        	
                        	checkbox.on('click', function(event){
                        		if(!tr.hasClass('new-data') && !tr.hasClass('edit-data'))
                        			tr.addClass('edit-data');
                        		
                        		if(base.options.afterCheckBoxChange)
                        			base.afterCheckBoxChange($do(event.target), $do(event.target).parent().parent());
                        	});
                        }
                        else
                        {
                        	if(base.options.multiCheckBox)
                        	{
                        		checkbox.on('click', function(event){
                            		var obj = event.target;
                            		
                            		$do(tr).find('input[type=\"checkbox\"]').each(function(){
                            			this.checked = obj.checked;
                            		});
                            		
                            		event.stopPropagation();
                            		
                            		if(base.options.afterCheckBoxChange)
                            			base.afterCheckBoxChange($do(event.target), $do(event.target).parent().parent());
                            	});
                        	}
                        	else
                        	{
                        		if(base.options.afterCheckBoxChange)
                            	{
                            		checkbox.on('click', function(event){
                            			base.afterCheckBoxChange($do(event.target), $do(event.target).parent().parent());
                                	});
                            	}	
                        	}
                       	}
                    }
                	else if(dataType == 'no')
                    {
                    	td.html(Number(base.dataGridTableBody.find('tr').length + 1) + Number((base.currentPageNo - 1) * base.options.rowsPerPage));
                    }
                    else if(dataType == 'textbox' || dataType == 'numberbox' || dataType == 'monthpicker' || dataType == 'datepicker' || dataType == 'timepicker' || dataType == 'textboxWithButton' || dataType == 'searchbox')
                    {
                    	var textbox = $do('<input type="text">');
                    	
                    	if(dataType == 'textboxWithButton') textbox.css('width', 'calc(100% - 25px)');
                    	else if(dataType == 'searchbox')	textbox.css('width', 'calc(100% - 50px)');
                    	else								textbox.css('width', '100%');
                    	
                    	textbox.attr('name', dataField);
                    	
                    	if(base.columns[i].placeholder) textbox.attr('placeholder', base.columns[i].placeholder);
                    	
                    	textbox.on('change', function(event){
                    		if(!tr.hasClass('new-data') && !tr.hasClass('edit-data'))
                    			tr.addClass('edit-data');
                    		
                         	if(base.options.afterTextBoxChange)
                        		base.afterTextBoxChange($do(event.target), $do(event.target).parent().parent());
                    	});
                    	
                    	if(dataType == 'textboxWithButton')	td.addClass('column-textbox column-textbox-with-button');
                    	else if(dataType == 'searchbox')	td.addClass('column-textbox column-searchbox');
                    	else								td.addClass('column-textbox');
                    	
                    	if(data && data[dataField] != null && data[dataField] != undefined)	
                    		textbox.val(data[dataField]);
                    	else
                    	{
                    		if(base.columns[i].defaultValue)	textbox.val(base.columns[i].defaultValue);
                    	}
                    	
                    	td.append(textbox);
                    	
                    	if(dataType == 'textboxWithButton')
                        {
                        	if(base.columns[i].readonly)
                            	textbox.readOnly = true;
                        	
                        	var btnImage = $do('<img>');
                        	btnImage.addClass('btn-textbox');
                        	btnImage.attr('src', base.options.rootUrl + 'images/icon04_search.png');
                        	
                        	btnImage.on('click', function(event) {
                            	if(!tr.hasClass('new-data') && !tr.hasClass('edit-data'))
                        			tr.addClass('edit-data');
                            });
                            
                        	td.append(btnImage);
                        }
                    	else if(dataType == 'searchbox')
                        {
                        	if(base.columns[i].readonly)
                            	textbox.readOnly = true;
                        	
                        	var btnSearch = $do('<img>')
                        	btnSearch.addClass('btn-search');
                        	btnSearch.attr('src', base.options.rootUrl + 'images/icon04_search.png');
                        	
                        	btnSearch.on('click', function(event) {
                            	if(!tr.hasClass('new-data') && !tr.hasClass('edit-data'))
                        			tr.addClass('edit-data');
                            });
                            
                        	td.append(btnSearch);
                        	
                        	var btnReset = $do('<img>')
                        	btnReset.addClass('btn-reset');
                        	btnReset.attr('src', base.options.rootUrl + 'images/icon04_reset.png');
                        	
                        	btnReset.on('click', function(event) {
                        		$do(event.target).parent().find('input').val('');
                            });
                            
                        	td.append(btnReset);
                        }
                    	else if(dataType == 'monthpicker')
                        	base.setMonthPicker(textbox);
                        else if(dataType == 'datepicker')
                        {
                        	textbox.attr('autocomplete', 'off');
                        	
                        	base.setDatePicker(textbox, base.columns[i].datePickerYearRange);
                        }
                        else if(dataType == 'timepicker')
                        	base.setTimePicker(textbox, base.columns[i].timePickerStep, base.columns[i].timeFormat);
                    	
                    	if (dataType == 'textbox' || dataType == 'numberbox')
                        {
                        	if(base.options.afterInputKeyUp)
                        	{
                        		textbox.on('keyup', function(event) {
                                    base.afterInputKeyUp($do(event.target), $do(event.target).parent().parent());
                                });
                        	}
                        	
                        	textbox.on('click', function (event) { $do(this).select(); });
                        }
                        
                        if (dataType == 'numberbox')
                        {
                        	textbox.on('focus', function (event) {
                        		base.numberboxOriginValue = $do(this).val();
                        	});
                        	
                        	textbox.on('change', function (event) {	
                        		if(!(/^[+-]?\d*(\.?\d*)$/).test($do(this).val()))
                    			{
                        			$do(this).val(base.numberboxOriginValue);
                    			}
                        		else
                        		{
                        			$do(this).val(Number($do(this).val()));
                        		}
                        		
                        		if(!tr.hasClass('new-data') && !tr.hasClass('edit-data'))
                        			tr.addClass('edit-data');
                        		
                        		base.afterNumberBoxChange($do(event.target), $do(event.target).parent().parent());
                        	});
                        }
                    }
                    else if(dataType == 'selectbox')
                    {
                    	var selectbox = $do('<select></select>');
                    	selectbox.css('width', '100%');
                    	selectbox.onChange(function(event){
                    		if(!tr.hasClass('new-data') && !tr.hasClass('edit-data'))
                    			tr.addClass('edit-data');
                    		
                    		var target = $do(this);
                    		
                    		target.find('option').removeAttr('selected');
                    		target.find('[value="' + target.val()  + '"]').attr('selected', '');
                    		
                        	if(base.options.afterSelectBoxChange)
                        		base.afterSelectBoxChange(target, target.parent().parent());
                    	});
                    	
                    	if(base.columns[i].options)
                    	{
                    		var options = base.columns[i].options;
                    		var selectIndex = 0;
                    		
                    		for(var optionIdx = 0; optionIdx < options.length; optionIdx++)
                    		{
                    			var optionValue = options[optionIdx].value;
                    			var option = $do('<option></option>');
                    			option.val(optionValue);
                    			option.append(options[optionIdx].text);
	                        	
                    			if(data && optionValue == data[dataField])
                    			{
                    				option.attr('selected', '');
                    				// selectIndex = optionIdx;
                    			}
                    			
                    			selectbox.append(option);
                    		}
                    		
                    		// selectbox.find('option [value=""]').eq(selectIndex).prop('selected', true);
                    	}
                    	
                    	td.addClass('column-selectbox');
                    	td.append(selectbox);
                    }
                    else if(dataType == 'image')
                    {
                    	td.attr('class', 'column-image');
                    	
                        var image = $do('<img>');
                        image.attr('src', data[base.columns[i].dataField]);

                        if(base.options.afterImgClick)
                        {
                        	image.css('cursor', 'pointer');
                        	
                        	image.on('click', function(event){
                            	base.afterImgClick($do(event.target).parent());
                            });
                        }
                        
                        td.append(image);
                    }
                    else if(dataType == 'button')
                    {
                    	td.attr('class', 'column-button');

                    	var buttonLength = base.columns[i].buttons.length;
                    	
                    	for(var j = 0; j < buttonLength; j++)
                    	{
                    		var button = $do('<span></span>');
                            button.attr('class', 'btn-span btn-span-' + j + ' btn_st03');
                            button.html(base.columns[i].buttons[j]);

                            td.append(button);
                            
                            if(base.options.afterButtonClick)
                        	{
                            	button.css('cursor', 'pointer');
                            	
                            	button.on('click', function(event){
                                	base.afterButtonClick($do(event.target));
                                	
                                	event.preventDefault();
                                	event.stopPropagation();
                                });
                        	}
                        }
                    }
                }
                else
                {
                    td.attr('class', 'column-string');
                    
                    if(data && data[dataField] != null && data[dataField] != undefined)
                    	td.html(data[dataField]);
                }

                tr.append(td);
            }
            
            if(base.options.afterRowClick)	tr.css('cursor', 'pointer');
            
            tr.on('click', function(event){
            	base.rowClickEvent(event, 'Click');
            });
            
            base.dataGridTableBody.append(tr);
        },
        rowClickEvent: function(event, clickType)
        {
        	var base = this;
        	
        	if($do(event.target).is('input[type=checkbox]') || $do(event.target).is('input[type=text]') || $do(event.target).is('select'))
        		return;
        	
        	/*
        	if($do(event.target).hasClass('column-checkbox') && $do(event.target).find('input[type=checkbox]'))
        	{
        		var checkBox = $do(event.target).find('input[type=checkbox]');
        		var isChecked = checkBox.is(':checked');
        		
        		if (isChecked)
        			checkBox.prop('checked', false);
        		else
        			checkBox.prop('checked', true);
        		
        		if(base.options.multiCheckBox)
        		{
        			$do(event.target).parents('tr').find('input[type="checkbox"]').each(function(){
            			if(isChecked)
            				$do(this).prop('checked', false);
            			else
            				$do(this).prop('checked', true);
            		});	
        		}
        		
            	if(base.options.afterCheckBoxChange)
        			base.afterCheckBoxChange($do(event.target), $do(event.target).parent().parent());
        		
        		return;
        	}
        	*/
        	
        	if(base.options.afterRowClick || base.options.afterRowDoubleClick || base.options.afterRowRightClick)
        	{
        		base.dataGridTable.find('.selected').removeClass('selected');
        		
        		// $do(event.target).parent().addClass('selected');
        		
        		if(clickType == 'Click')
        			base.afterRowClick($do(event.target).parent());
        	}
        },
        removeRow: function(triggerFunction){
        	/*
        	var base = this;
        	
        	var removedItems = [];
        	
        	var isDeletedItem = false;
        	
	        base.dataGridTable.find('tbody tr').each(function(i, elem){
	        	if($do(this).find('input[type="checkbox"]').filter(function(){return !$do(this).attr('name');}).is(':checked'))
	        	{
	        		if(!$do(this).hasClass('new-data'))
	        		{
		        		var removedItem = {};
		        		
			        	for (var i = 0; i < base.rowAttr.length; i++)
		        		{
		        			var rowAttrValue = $do(this).attr(base.rowAttr[i].name);
		        			
		        			if(!rowAttrValue)
		        				rowAttrValue = base.rowAttr[i].name;
		        			
		        			removedItem[base.rowAttr[i].name] = rowAttrValue;
		        		}
		        		
		        		removedItems.push(removedItem);
		        		
		        		isDeletedItem = true;
	        		}
	        		
	        		$do(this).remove();
	        	}
	        });
	        
            if(triggerFunction && isDeletedItem) triggerFunction.apply(this, [removedItems]);
            
            if(base.dataGridTable.find('tbody tr').length == 0)	base.dataGridTable.find('thead input[type="checkbox"]').prop('checked', false);
            
            if(base.options.afterRemoveRow)	base.afterRemoveRow();
            */
        },
        retrieveList: function(requestData, type, fnNewSuccess, fnNewError) {
        	var base = this;
        	
        	if(base.options.webServiceUrl)
        	{
            	var fnSuccess = function(response){
            		if(response.rowAttr)	base.rowAttr = response.rowAttr;
            		
            		if(response.columns)
            		{
            			base.columns = response.columns;
            			base.setDataSource(response.data, response.totalDataCount, 'init');
            		}
            		else
            		{
            			base.setDataSource(response.data, response.totalDataCount);
            		}
            		
                    if(base.options.afterRetrieveList) base.afterRetrieveList();
            	};
            	
            	var fnError = function(xhr, status, error){
            		if (xhr.status == 401) {
            			alert('인증에 실패 했습니다. 로그인 페이지로 이동합니다.');
            			location.href = base.options.rootUrl + 'login';
					} else if (xhr.status == 403) {
						/*
						if(base.options.language == 'kr')	alert('사용 권한 없음 액세스가 거부되었습니다. 로그인 페이지로 이동합니다.');
						else								alert('The session has expired. Go to the login page.');
						*/
						
		        		location.href = 'login';
					}
					else if(xhr.status == 0) {
						// 화면 세로고침시 발생
						return;
					}
					else {
						if(base.options.language == 'kr')	alert('예외가 발생했습니다. 관리자에게 문의하세요. [Code : ' + xhr.status + ']');
						else								alert('Error. Ask Administrator. [Code : ' + xhr.status + ']');
					}
            		
            		console.error('[Error] doDataGrid retrieveList : code:'+xhr.status+'\n'+'message:'+xhr.responseText+'\n'+'error:'+error);
    			};
    			
    			if(type != 'pagination' && type != 'order' && type != 'changeRowsPerPage')
    			{
    				base.requestData = requestData;
    				base.currentPageNo = 1;
    			}
    			
    			base.appendRequestData('rowsPerPage=' + base.rowsPerPage);
    			base.appendRequestData('page=' + base.currentPageNo);
    			
    			if(fnNewSuccess)	fnSuccess = fnNewSuccess;
    			
    			if(fnNewError)		fnError = fnNewSuccess;
        		
    			DoAjax.ajaxObject('POST', base.options.webServiceUrl, base.requestData, fnSuccess, fnError);
        	}
        },
        appendRequestData: function(data) {
        	var base = this;
        	var isAppend = false;
        	var newRequestData = '';
        	var requestDatas = base.requestData.split('&');
        	var requestDataLength = requestDatas.length;
        	
        	for(var i = 0; i < requestDataLength; i++)
        	{
        		if(requestDatas[i].split('=')[0] == data.split('=')[0])
        		{
        			requestDatas[i] = data;
        			isAppend = true;
        		}
        				
        		if(i == 0)	newRequestData = requestDatas[i];
        		else		newRequestData = newRequestData + '&' + requestDatas[i];
        	}
        	
        	if(!isAppend) newRequestData = newRequestData + '&' + data;
        	
        	base.requestData = newRequestData;
        },
        setDataSource: function(dataSource, totalDataCount, type) {
            var base = this;

            base.dataSource		= dataSource;
            base.totalDataCount = totalDataCount;
            
            base.buildDataGridBody(type);
            
            base.elem.find('.data-total-count-container .count').html(totalDataCount);
        },
        buildPagination: function() {
            var base = this;
            
            if(base.options.pagination === true)
            {
            	base.dataGridFooter.find('.page_nav').remove();
            	
            	base.pagenation = $do('<div class="page_nav"></div>');
            	base.dataGridFooter.append(base.pagenation);
            	
            	var totalPage 		= Math.ceil(base.totalDataCount / base.rowsPerPage);
            	var totalPageList 	= Math.ceil(totalPage / base.options.pageCount);
            	var pageList 		= Math.ceil(base.currentPageNo / base.options.pageCount);

            	if(pageList < 1) pageList = 1;
            	
            	if(pageList > totalPageList) pageList = totalPageList;

            	var startPageList 	= (pageList-1) * base.options.pageCount + 1;
            	var endPageList 	= startPageList + base.options.pageCount - 1;

            	if(startPageList < 1) 		startPageList	= 1;
            	if(endPageList > totalPage) endPageList		= totalPage;
            	if(endPageList < 1)			endPageList		= 1;

            	var pageInner = '<div>';

            	if(startPageList != 1)
            	{
            		pageInner += '<p class="inact_btn"><a href="#" no="' + (startPageList - 1) + '">&lt;</a></p>';
            	}
            	
            	pageInner += '<ol>';
            	
            	for(var i = startPageList; i <= endPageList; i++)
            	{
            		if(base.currentPageNo != i)
            			pageInner += '<li><a href="#" class="other" no="' + (i) + '">' + (i) + '</a></li>';
            		else
            			pageInner += '<li><a href="#" class="this">' + (i) + '</a></li>';
            	}
            	
            	pageInner += '</ol>';
            	
            	if(endPageList != totalPage && totalPage != 0)
            	{
            		pageInner += '<p class="inact_btn"><a href="#" no="' + (endPageList + 1) + '">&gt;</a></p>';
            	}
            	
            	pageInner += '</div>';
            	
            	base.pagenation.append(pageInner);
            	
            	base.pagenation.off('click', 'a');
            	base.pagenation.on('click', 'a', function(event) {
            		if($(this).hasClass('this'))
            			return;
            		else
            		{
            			base.currentPageNo = $do(this).attr('no');
            			
            			base.retrieveList(base.requestData, 'pagination');
            		}
            		
            		event.preventDefault();
            	});
            }
        },
        getAllItem: function(passNull) {
        	var base = this;
        	
        	var allItems = [];
        	
        	console.log(base.dataGridTableBody.find("tr"));
        	
        	base.dataGridTableBody.find("tr").each(function(itemTr){
        		var rowItem = {};

        		var rowAttrLength = base.rowAttr.length;
        		
        		for (var i = 0; i < rowAttrLength; i++)
        		{
        			var rowAttrValue = $do(itemTr).attr(base.rowAttr[i].name);

        			if(!rowAttrValue && !passNull)
        				rowAttrValue = base.rowAttr[i].name;
        			
        			rowItem[base.rowAttr[i].name] = rowAttrValue;
        		}
        		
        		var isNoData = false;

        		$do(itemTr).find('td').each(function(itemTd){
        			var td = $do(itemTd);
        			
    				if(td.hasClass("no-data"))
    				{
    					isNoData = true;
    					return;
    				}
    				else if(td.hasClass("column-string"))
    				{
    					rowItem[td.attr("column-name")] = td.html().replace(/&amp;/, "&");
    				}
    				else if(td.hasClass("column-textbox"))
    				{
    					rowItem[td.attr("column-name")] = td.find("input[type='text']").val();
    				}
    				else if(td.hasClass("column-selectbox"))
    				{
    					rowItem[td.attr("column-name")] = td.find("select").val();
    				}
    				else if(td.hasClass("column-checkbox"))
    				{
    					if(td.attr("column-name"))
    					{
    						if(td.find("input[type='checkbox']").is(":checked"))
    							rowItem[td.attr("column-name")] = "checked";
    						else
    							rowItem[td.attr("column-name")] = "unchecked";
    					}
    				}
    			});

    			if(!isNoData) allItems.push(rowItem);
        	});
        	
        	return allItems;
        },
        afterRetrieveList: function(){
            var base = this;
            
            if(base.options.afterRetrieveList)
                base.options.afterRetrieveList.apply(this, [base.elem]);
        },
        afterRemoveRow: function(){
        	var base = this;
            
            if(base.options.afterRemoveRow)
                base.options.afterRemoveRow.apply(this, [base.elem]);
        },
        afterRowClick: function(el){
        	var base = this;
            
            if(base.options.afterRowClick)
                base.options.afterRowClick.apply(this, [el]);
        },
        afterInputKeyUp: function(el, parentEl){
    		var base = this;
    		
    		if (base.options.afterInputKeyUp)
        	   base.options.afterInputKeyUp.apply(this, [el, parentEl]);
    	},
    	afterNumberBoxChange: function(el, parentEl){
    		var base = this;
    		
    		if (base.options.afterNumberBoxChange)
        	   base.options.afterNumberBoxChange.apply(this, [el, parentEl]);
    	},
    	afterSelectBoxChange: function(el, parentEl) {
    		var base = this;
    		
    		if (base.options.afterSelectBoxChange)
         	   base.options.afterSelectBoxChange.apply(this, [el, parentEl]);
    	},
    	afterCheckBoxChange: function(el, parentEl) {
    		var base = this;
    		
    		if(base.options.afterCheckBoxChange)
    			 base.options.afterCheckBoxChange.apply(this, [el, parentEl]);
    	},
    	afterTextBoxChange: function(el, parentEl){
    		var base = this;
    		
    		if (base.options.afterTextBoxChange)
        	   base.options.afterTextBoxChange.apply(this, [el, parentEl]);
    	},
        afterImgClick: function(el){
        	var base = this;
            
            if(base.options.afterImgClick)
                base.options.afterImgClick.apply(this, [el]);
        },
        afterButtonClick: function(el){
        	var base = this;
            
            if(base.options.afterButtonClick)
                base.options.afterButtonClick.apply(this, [el]);
        },
        customEvents: function() {
            var base = this;
            base.elem.on('addRow', function(event, data) {
            	base.addRow(data, 'new');
            	
            	if(data !== undefined && data.afterAddRow !== undefined)
            		data.afterAddRow.apply(this);
            });
            base.elem.on('addRowNotDupl', function(event, data){
            	base.addRow(data, 'new', true);
            });
            base.elem.on('addRowAtBottom', function(event, data){
            	base.addRow(data, 'append');
            });
            base.elem.on('removeRow', function(event, triggerFunction) {
            	base.removeRow(triggerFunction);
            });
            base.elem.on('retrieveList', function(event, requestData, type){
            	base.retrieveList(requestData, type);
            });
        }
	}
	
	$do.pt.doDataGrid = function(options) {
		return this.each(function(item){
			var doDataGrid = Object.create(DoDataGridTest);
	        doDataGrid.init(options, item);
	        
            this.data('doDataGrid', doDataGrid);
		});
	}
})($do);

var doDataGrid = {
	retrieveList: function(dataGrid, requestData, type){
		dataGrid.data("doDataGrid").retrieveList(requestData, type);
	},
	getAllItem: function(dataGrid, passNull)
	{
		return dataGrid.data("doDataGrid").getAllItem(passNull);
	}
};