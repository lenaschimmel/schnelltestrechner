import matplotlib.pyplot as plt
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix

import csv

with open('../src_data/pei.csv') as csvfile:
    data = list(csv.reader(csvfile, delimiter=';'))


print("manufacturer;name;intercept;coef;test")

def clean_value(val):
    d = 0
    try:
        d = float(val)
    except ValueError:
        d = 0 
    return d


def process_line(data_line, ct_line):
    x_values = list(map(clean_value, data[ct_line][4:54]))
    y_values = list(map(clean_value, data[data_line][4:54]))
    x = np.array(x_values).reshape(-1, 1)
    y = np.array(y_values)
    # liblinear or newton-cg
    model = LogisticRegression(solver='newton-cg', random_state=0, max_iter=1000)
    model.fit(x, y)

    #r = model.predict_proba(x)
    test = model.intercept_[0] / (-model.coef_[0][0])
    print("{};{};{};{};{}".format(data[data_line][0].replace(";",","), data[data_line][1].replace(";",","), model.intercept_[0], model.coef_[0][0], test))
    #print(np.array_str(r[:,1], precision=3, suppress_small=True))

for line in range(7, 40):
    process_line(line, 1)

for line in range(41, 126):
    process_line(line, 4)