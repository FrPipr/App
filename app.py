from langchain_community.llms import Ollama
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from flask import Flask, render_template, request, jsonify
app = Flask(__name__)
import prompts_variables_storage
llm = Ollama(model="llama3")

chat_history = []
start = prompts_variables_storage.initprompt
product_details=prompts_variables_storage.product
prompt_template_msg="{start} this is your data {product_details}"
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

def chatbot_response(user_prompt, itemcode):
    question = "You: "+ user_prompt
    print(question)
    if question == "done":
        return

    # response = llm.invoke(question)
    response = chain.invoke({"input": question, "chat_history": chat_history,"start":start,"product_details":product_details})
    chat_history.append(HumanMessage(content=question))
    chat_history.append(AIMessage(content=response))

    return response


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scan', methods=['POST'])
def scan():
    item_code = request.json['item_code']
    initial_message = f"Hello, you just scanned the item {item_code}. What would you like to know about it?"
    return jsonify({'message': initial_message, 'item_code': item_code})

@app.route('/ask', methods=['POST'])
def ask():
    user_input = request.json['message']
    item_code = request.json['item_code']
    bot_response = chatbot_response(user_input, item_code)
    return jsonify({'message': bot_response})

if __name__ == "__main__":
    app.run(debug=True)
