/*
 * Copyright (c) 2016 Bambora ( http://bambora.com/ )
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

package coffee.cloud.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;


import com.bambora.nativepayment.models.creditcard.CreditCard;

import java.util.ArrayList;
import java.util.List;

import coffee.cloud.R;

public class CardListAdapter extends BaseAdapter {

    private Context context;
    private List<CreditCard> creditCards = new ArrayList<>();

    public CardListAdapter(Context context, List<CreditCard> creditCards) {
        this.context = context;
        this.creditCards = creditCards != null ? creditCards : new ArrayList<CreditCard>();
    }

    @Override
    public int getCount() {
        return creditCards.size();
    }

    @Override
    public Object getItem(int position) {
        return creditCards.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder viewHolder;
        if (convertView == null) {
            convertView = LayoutInflater.from(context).inflate(R.layout.item_credit_card_list, null);
            viewHolder = new ViewHolder();
            viewHolder.aliasTextView = (TextView) convertView.findViewById(R.id.tv_card_text);
            viewHolder.cardNumberTextView = (TextView) convertView.findViewById(R.id.tv_card_details);
            convertView.setTag(viewHolder);
        } else {
            viewHolder = (ViewHolder) convertView.getTag();
        }
        CreditCard item = (CreditCard) getItem(position);
        if (item.getAlias() != null) {
            viewHolder.aliasTextView.setText(item.getAlias());
            viewHolder.cardNumberTextView.setText(item.getTruncatedCardNumber());
            viewHolder.cardNumberTextView.setVisibility(View.VISIBLE);
        } else {
            viewHolder.aliasTextView.setText(item.getTruncatedCardNumber());
            viewHolder.cardNumberTextView.setText("");
            viewHolder.cardNumberTextView.setVisibility(View.GONE);
        }
        return convertView;
    }

    private class ViewHolder {
        TextView aliasTextView;
        TextView cardNumberTextView;
    }
}
