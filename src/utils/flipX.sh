for img in `ls *.png`
do
  convert $img -flop left-$img
done
  