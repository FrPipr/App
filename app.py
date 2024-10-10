from langchain_community.llms import Ollama
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from flask import Flask, render_template, request, jsonify

import requests
from flask_cors import CORS
import prompts_variables_storage

app = Flask(__name__, instance_relative_config=True)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
#llm = Ollama(model="llama3")
#llm = Ollama(model="gemma2")
llm = Ollama(model="llama3.1")

chat_history = []
start = prompts_variables_storage.smaller_initprompt
productinfo= "No information available for this product at the moment"

def init_variables(productinfo):
    prompt_template_msg="{start} This is your knowledge base: {product_details}"
    prompt_template = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            prompt_template_msg,
        ),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
    ]
)
    chain = prompt_template | llm
    return chain

def chatbot_response(user_prompt, itemcode, productinfo):
    question = "You: "+ user_prompt
    
    if question == "done":
        return "Bye bye"

    # response = llm.invoke(question)
    chain=init_variables(productinfo)
    response = chain.invoke({"input": question, "chat_history": chat_history,"start":start,"product_details":productinfo})
    chat_history.append(HumanMessage(content=question))
    chat_history.append(AIMessage(content=response))
    print(chat_history)
    return response


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scan', methods=['POST'])
def scan():
    item_code = request.json['item_code']
    print("ATTEMPTING TO CONNECT:")
     # Send request to JavaScript server to get product details
    try: 
        response = requests.get(f'http://localhost:3000/readProduct?productId={item_code}')
        if response.status_code == 200:
            productinfo = response.json()
            globals()["productinfo"]=productinfo
            initial_message = f"Hello, you just scanned the item {item_code}. What would you like to know about it?"
        else:
            initial_message = f"Hello, you just scanned the item {item_code}. At the moment i'm unable to retrieve product details."

    except: initial_message = "Cannot connect to the server"
    
    return jsonify({'message': initial_message, 'item_code': item_code})


@app.route('/getProduct', methods=['GET'])
def get_product():
    productId = request.args.get('productId')
    print("ATTEMPTING TO CONNECT:")
     # Send request to JavaScript server to get product details
    try: 
        response = requests.get(f'http://localhost:3000/readProduct?productId={productId}')
        if response.status_code == 200:
            productinfo = response.json()
            return jsonify(response.json())
        else:
            return jsonify({'message': 'Failed to get product.'}), 500
    except Exception as e:
        print("Failed to get product:", e)
        return jsonify({'message': 'Failed to get product.'}), 500
    
@app.route('/ask', methods=['POST'])
def ask():
    user_input = request.json['message']
    item_code = request.json['item_code']
    print("Sending the request with the following informations:")
    print(productinfo)
    bot_response = chatbot_response(user_input, item_code, productinfo)
    return jsonify({'message': bot_response})

@app.route('/uploadProduct', methods=['POST'])
def upload_product():
    product_data = request.json
    print("Uploading new product data:", product_data)
    try:
        response = requests.post('http://localhost:3000/uploadProduct', json=product_data)
        if response.status_code == 200:
            return jsonify({'message': 'Product uploaded successfully!'})
        else:
            return jsonify({'message': 'Failed to upload product.'}), 500
    except Exception as e:
        print("Error uploading product:", e)
        return jsonify({'message': 'Error uploading product.'}), 500


@app.route('/updateProduct', methods=['POST'])
def update_product():
    product_data  = request.json
    print("Update Product:", product_data)
    try:
        response = requests.post('http://localhost:3000/api/product/updateProduct', json=product_data)
        if response.status_code == 200:
            return jsonify({'message': 'Product updated successfully!'})
        else:
            return jsonify({'message': 'Failed to update product.'}), 500
    except Exception as e:
        print("Error uploading product:", e)
        return jsonify({'message': 'Error uploading product.'}), 500

@app.route('/addSensorData', methods=['POST'])
def add_sensor_data():
    sensor_data  = request.json
    print("Uploading sensor data:", sensor_data)
    try:
        response = requests.post('http://localhost:3000/api/product/sensor', json=sensor_data)
        if response.status_code == 200:
            return jsonify({'message': 'Product uploaded successfully!'})
        else:
            return jsonify({'message': 'Failed to upload product.'}), 500
    except Exception as e:
        print("Error uploading product:", e)
        return jsonify({'message': 'Error uploading product.'}), 500

@app.route('/addMovementsData', methods=['POST'])
def add_movement_data():
    movement_data  = request.json
    print("Add movement data:", movement_data)
    try:
        response = requests.post('http://localhost:3000/api/product/movement', json=movement_data)
        if response.status_code == 200:
            return jsonify({'message': 'Product uploaded successfully!'})
        else:
            return jsonify({'message': 'Failed to upload product.'}), 500
    except Exception as e:
        print("Error uploading product:", e)
        return jsonify({'message': 'Error uploading product.'}), 500

@app.route('/addCertification', methods=['POST'])
def add_certification_data():
    certification_data  = request.json
    print("Add certification data:", certification_data)
    try:
        response = requests.post('http://localhost:3000/api/product/certification', json=certification_data)
        if response.status_code == 200:
            return jsonify({'message': 'Product uploaded successfully!'})
        else:
            return jsonify({'message': 'Failed to upload product.'}), 500
    except Exception as e:
        print("Error uploading product:", e)
        return jsonify({'message': 'Error uploading product.'}), 500


@app.route('/verifyProductCompliance', methods=['POST'])
def verify_product_compliance():
    compliance_data  = request.json
    print("Check if product is complaint:", compliance_data)
    try:
        response = requests.post('http://localhost:3000/api/product/verifyProductCompliance', json=compliance_data)
        print(response.json())
        if response.status_code == 200:
            return jsonify({'message': 'Product is compliant!'})
        else:
            return jsonify({'message': 'Product is not complaint'}), 500
    except Exception as e:
        print("Error while checking product:", e)
        return jsonify({'message': 'Error while checking product.'}), 500


@app.route('/getAllMovements', methods=['GET'])
def get_all_movements():
    productId = request.args.get('productId')
    print("get all movements:", productId)
    try:
        response = requests.get(f'http://localhost:3000/api/product/getMovements?productId={productId}')
        print(response.json())
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'message': 'Failed to get movements'}), 500
    except Exception as e:
        print("EFailed to get movements:", e)
        return jsonify({'message': 'Failed to get movements.'}), 500

@app.route('/getAllSensorData', methods=['GET'])
def get_all_sensor_data():
    productId = request.args.get('productId')
    print("get all sensor:", productId)
    try:
        response = requests.get(f'http://localhost:3000/api/product/getSensorData?productId={productId}')
        print(response.json())
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'message': 'Failed to get sensor data'}), 500
    except Exception as e:
        print("EFailed to get movements:", e)
        return jsonify({'message': 'Failed to get sensor data.'}), 500

@app.route('/getAllCertifications', methods=['GET'])
def get_all_certifications():
    productId = request.args.get('productId')
    print("get all certifications:", productId)
    try:
        response = requests.get(f'http://localhost:3000/api/product/getCertifications?productId={productId}')
        print(response.json())
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'message': 'Failed to get certifications'}), 500
    except Exception as e:
        print("Failed to get certifications:", e)
        return jsonify({'message': 'Failed to get certifications.'}), 500

if __name__ == "__main__":
    app.run(debug=True)
