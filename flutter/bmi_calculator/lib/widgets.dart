import 'package:flutter/material.dart';

class Field extends StatelessWidget {
  final TextField textField;

  const Field({super.key, required this.textField});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        margin: EdgeInsets.all(15.0),
        padding: EdgeInsets.all(3.0),
        color: Colors.green,
        child: textField,
      ),
    );
  }
}


class MainBMI extends StatefulWidget {
  const MainBMI({super.key});

  @override
  State<MainBMI> createState() => _MainBMIState();
}



class _MainBMIState extends State<MainBMI> {
  final TextEditingController _heightController = TextEditingController();
  final TextEditingController _weightController = TextEditingController();

  double _bmi = 0.0;
  

  void _calculateBMI() {

    double? height = double.tryParse(_heightController.text);
    double? weight = double.tryParse(_weightController.text);

    if (height != null && weight != null && height > 0) {
      setState(() {
        _bmi = weight / (height * height);
      });
    } else {
      // Show error or keep _bmi as 0
      setState(() {
        _bmi = 0.0;
      });
    }
  }

  
  
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        backgroundColor: Colors.black,
        appBar: AppBar(
          backgroundColor: Colors.green,
          title: Center(
            child: Text(
              "BMI Calculator",
              style: TextStyle(
                color: Colors.black,
                fontSize: 35,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ),
        body: Column(
          children: [
            SizedBox(height: 10),
            Container(
              margin: EdgeInsets.all(15),
              padding: EdgeInsets.all(10),
              color: Colors.green, 
              child: Center(
                child: Text(
                  style: TextStyle(color: Colors.black, fontSize: 20),
                  "Welcome to the BMI Calculator! Enter your height and weight (metric) and click the calculator button to see your BMI!"
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Field(
                  textField: TextField(
                    controller: _heightController,
                    decoration: InputDecoration(
                      hintText: "meters",
                      label: Text("Height (m)", style: TextStyle(color: Colors.black))
                    ),
                  ),
                ),
                Field(
                  textField: TextField(
                    controller: _weightController,
                    decoration: InputDecoration(
                      hintText: "kilograms",
                      label: Text("Weight (kg)", style: TextStyle(color: Colors.black))
                    ),
                  ),
                ),
              ],
            ),
            Container(
              margin: EdgeInsets.all(15),
              padding: EdgeInsets.all(10),
              color: Colors.green,
              child: Text("BMI Calculation:\n${_bmi.toStringAsFixed(3)}", textAlign: TextAlign.center, style: TextStyle(color: Colors.black, fontSize: 50, )),
            ),
            Container(
              color: Colors.green,
              margin: EdgeInsets.all(15),
              padding: EdgeInsets.all(10),
              child: Center(
                child: Text(
                  "Made with ❤️ by Pravir Sachanandani",
                  style: TextStyle(color: Colors.black)
                ),
              ),
            ),
            FloatingActionButton(
              backgroundColor: Colors.green,
              onPressed: _calculateBMI,
              child: Icon(Icons.calculate, color: Colors.black),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _heightController.dispose();
    _weightController.dispose();
    super.dispose();
  }
}