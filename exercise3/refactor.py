#refactor current code,with better variable names and function names


def filter_items_by_type(items, item_type):
    filtered_items = []
    for item in items:
        if item["t"] == item_type:
            filtered_items.append(item)
    return filtered_items

# Usage example:
items = [
    {"id": 1, "t": "book", "price": 20},
    {"id": 2, "t": "food", "price": 10},
    {"id": 3, "t": "book", "price": 15},
    {"id": 4, "t": "food", "price": 5}
]
books = filter_items_by_type(items, "book")


#add a few test cases
print(books) # Expected: [{"id": 1, "t": "book", "price": 20}, {"id": 3, "t": "book", "price": 15}]
print(filter_items_by_type(items, "food")) # Expected: [{"id": 2, "t": "food", "price": 10}, {"id": 4, "t": "food", "price": 5}]
print(filter_items_by_type(items, "clothes")) # Expected: []
print(filter_items_by_type([], "book")) # Expected: []