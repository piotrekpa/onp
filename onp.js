
var Calculator = function(){
	this.stack = [];
	this.prior = {'(' : 0, ')' : 1, '+' : 2, '-' : 2, '*' : 3, '/' : 3};
	this.result = [];
	this.temp = [];
};

Calculator.prototype = {
	parse : function(expression){
		var c, p, o, // znak, priorytet, obiekt ({c:znak, p:priorytet})
			tempC,
			temp = this.temp,
			resC,
			prior = this.prior,
			getPrior = function(el){
				return prior.hasOwnProperty(el) ? prior[el] : -1;
			},
			stack = this.stack;

		if(expression == "") { return; }
		expression = expression.split("");
		while(c = expression.shift()){
			p = getPrior(c), o = {c:c,p:p};

			// jesli symbol to do stosu
			if(p == -1){
				stack.push(o);
			}

			//jesli ( to do pomocnicznego
			if(p == 0){
				temp.push(o);
			}

			//jesli ) 
			if(p == 1){
				tempC = null;
				while(tempC = temp.pop()){
					
					if(tempC.p >= 1) { stack.push(tempC);}
					if(tempC.p == 0) { break; }
				}
			}

			//inny
			if(p > 1){
				if(temp.length == 0 || temp[temp.length - 1].p < p){
					temp.push(o);
				}else{
					stack.push(temp.pop());
					temp.push(o);
				}
			}
		}

		while(resC = temp.pop()){
			stack.push(resC);
		}
	},

	calc : function(){
		var c,
			stack = this.stack,
			temp = this.result,
			operation = this.operation;

		while(c = stack.shift()){
			if(c.p == -1 ){
				temp.push(c);
			}else{
				temp.push({c:operation.call(this, c.c, temp)});
			}
		}

		return temp.length == 1 ? temp[0].c : null;
	},

	operation : function(operator){
		var temp = this.result,
			r;
		switch(operator){
			case '+':
				return +(temp.pop().c) + +(temp.pop().c);
				break;
			case '-':
				//console.log((temp.pop().c), (temp.pop().c))
				var r = +(temp.pop().c);
				return +(temp.pop().c) - r;
				break;
			case '*':
				return +(temp.pop().c) * +(temp.pop().c);
				break;
			case '/':
				var r = +temp.pop().c
				return +temp.pop().c / r;
				break;
		}
		
	},

	printStack : function(arr, sep){
		var i = 0; max = arr.length, stack = arr, temp = [];
		sep = sep || ' ';
		for(i; i < max; i++){
			temp.push(stack[i].c);
		}
		return temp.join(sep);
	},

	run : function(expression){
		this.parse(expression);
		return this.calc();
	}
};


$(function(){

	$('#from-expression').submit(function(e){
		e.preventDefault();
		var calc = new Calculator();

		$('#result-box').show();
		calc.parse($('#expression').val());
		$('#exp-to-onp').text(calc.printStack(calc.stack, '; '));

		$('#result').text(calc.calc());
		
	});
});